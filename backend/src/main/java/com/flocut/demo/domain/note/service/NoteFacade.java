package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.mapper.NoteMapper;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Log4j2
public class NoteFacade {

    private final NoteService noteService;
    private final NoteMapper noteMapper;

    // Redis는 String-only 전략
    private final RedisTemplate<String, String> redisTemplate;

    private static final String CACHE_KEY_PREFIX = "note:buffer:";
    private static final String INDEX_KEY = "note:buffer:index";
    private static final int CACHE_TTL_MINUTES = 30;

    
    // 목록 조회 (DB + Redis 병합)
    
    public PageResponseDTO<NoteResponseDTO> getNotesByStatusWithCache(
            Long sessionId,
            Member member,
            CommonStatus status,
            PageRequestDTO pageRequest
    ) {

        PageResponseDTO<Note> basePage =
                noteService.getNotesByStatus(sessionId, member, status, pageRequest);

        List<Note> notes = basePage.getContent();
        if (notes.isEmpty()) {
            return new PageResponseDTO<>(
                    List.of(),
                    basePage.getTotalElements(),
                    basePage.getTotalPages(),
                    basePage.getPageNumber(),
                    basePage.getPageSize(),
                    basePage.isHasNext(),
                    basePage.isHasPrevious(),
                    basePage.isFirst(),
                    basePage.isLast()
            );
        }

        // Redis pipeline (title, lastModified만)
        List<Object> pipeline =
                redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
                    for (Note note : notes) {
                        byte[] key = (CACHE_KEY_PREFIX + note.getNoteId()).getBytes();
                        connection.hashCommands().hGet(key, "title".getBytes());
                        connection.hashCommands().hGet(key, "lastModified".getBytes());
                    }
                    return null;
                });

        List<NoteResponseDTO> merged = new ArrayList<>(notes.size());

        for (int i = 0; i < notes.size(); i++) {
            NoteResponseDTO base = noteMapper.toNoteResponseDTO(notes.get(i));

            String cachedTitle =
                    pipeline.get(i * 2) != null ? pipeline.get(i * 2).toString() : null;
            String cachedModified =
                    pipeline.get(i * 2 + 1) != null ? pipeline.get(i * 2 + 1).toString() : null;

            String mergedModdate = base.moddate();

            if (cachedModified != null) {
                try {
                    mergedModdate =
                            Instant.ofEpochMilli(Long.parseLong(cachedModified))
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDateTime()
                                    .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (Exception ignore) {}
            }

            merged.add(new NoteResponseDTO(
                    base.noteId(),
                    base.sessionId(),
                    cachedTitle != null ? cachedTitle : base.title(),
                    base.sourceType(),
                    base.sourceId(),
                    base.status(),
                    base.regdate(),
                    mergedModdate
            ));
        }

        return new PageResponseDTO<>(
                merged,
                basePage.getTotalElements(),
                basePage.getTotalPages(),
                basePage.getPageNumber(),
                basePage.getPageSize(),
                basePage.isHasNext(),
                basePage.isHasPrevious(),
                basePage.isFirst(),
                basePage.isLast()
        );
    }

    
    // 자동 저장
    
    public void autoSave(Long noteId, Member member, String title, String content) {

        // 소유권 검증
        noteService.getNote(noteId, member);

        String key = CACHE_KEY_PREFIX + noteId;

        if (title != null) {
            redisTemplate.opsForHash().put(key, "title", title);
        }

        if (content != null) {
            redisTemplate.opsForHash().put(key, "content", content);
        }

        redisTemplate.opsForHash().put(
                key,
                "lastModified",
                String.valueOf(System.currentTimeMillis())
        );

        redisTemplate.opsForSet().add(INDEX_KEY, String.valueOf(noteId));
        redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);

        // TTL 보호 로직
        Long ttl = redisTemplate.getExpire(key, TimeUnit.MINUTES);
        if (ttl != null && ttl > 0 && ttl < 10) {
            log.warn(
                    "TTL 부족 감지 - 캐시 유실 위험 [noteId={}, TTL={}분]",
                    noteId,
                    ttl
            );
        }
    }

    
    // 상세 조회
    
    public NoteDetailResponseDTO getNoteWithCache(Long noteId, Member member) {

        Note note = noteService.getNote(noteId, member);
        String key = CACHE_KEY_PREFIX + noteId;

        Map<String, String> cache =
                toStringMap(redisTemplate.opsForHash().entries(key));

        if (cache.isEmpty()) {
            return noteMapper.toNoteDetailResponseDTO(note);
        }

        NoteDetailResponseDTO base = noteMapper.toNoteDetailResponseDTO(note);

        return new NoteDetailResponseDTO(
                base.noteId(),
                base.sessionId(),
                cache.getOrDefault("title", base.title()),
                cache.getOrDefault("content", base.content()),
                base.sourceType(),
                base.sourceId(),
                base.summaryOption(),
                base.status(),
                base.regdate(),
                base.moddate()
        );
    }

    
    // 수동 저장
    
    @Transactional
    public void sync(Long noteId, Member member) {

        String key = CACHE_KEY_PREFIX + noteId;

        Map<String, String> cache =
                toStringMap(redisTemplate.opsForHash().entries(key));

        if (cache.isEmpty()) return;

        String title = cache.get("title");
        String content = cache.get("content");

        if (title == null && content == null) return;

        noteService.updateNote(
                noteId,
                member,
                new NoteUpdateRequestDTO(title, content)
        );

        redisTemplate.delete(key);
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
    }

    
    // 노트 이동 (캐시 보호 포함)
    
    @Transactional
    public void moveNoteWithCache(Long noteId, Long targetSessionId, Member member) {

        // 이동 전에 현재 편집 중인 Redis 데이터를 DB에 먼저 반영
        this.sync(noteId, member);

        // 실제 DB 세션 이동 처리
        noteService.moveNote(noteId, targetSessionId, member);

        log.info(
                "노트 이동 완료: noteId={}, targetSessionId={}",
                noteId,
                targetSessionId
        );
    }

    
    // 시스템 자동 동기화
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void systemSync(Long noteId) {

        String key = CACHE_KEY_PREFIX + noteId;

        String lastModified =
                (String) redisTemplate.opsForHash().get(key, "lastModified");

        if (lastModified == null) {
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
            return;
        }

        long elapsed = System.currentTimeMillis() - Long.parseLong(lastModified);
        if (elapsed < 300_000) return;

        Map<String, String> cache =
                toStringMap(redisTemplate.opsForHash().entries(key));

        if (cache.isEmpty()) {
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
            return;
        }

        noteService.updateNoteSystem(
                noteId,
                new NoteUpdateRequestDTO(
                        cache.get("title"),
                        cache.get("content")
                )
        );

        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
        redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
    }

    
    // 캐시 유틸
    
    public void clearCache(Long noteId) {
        redisTemplate.delete(CACHE_KEY_PREFIX + noteId);
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
    }

    public boolean hasCachedData(Long noteId) {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(CACHE_KEY_PREFIX + noteId)
        );
    }

    
    // Redis Hash → String Map 변환 (타입 경계)
    private Map<String, String> toStringMap(Map<Object, Object> source) {

        Map<String, String> result = new HashMap<>();

        if (source == null || source.isEmpty()) {
            return result;
        }

        for (Map.Entry<Object, Object> entry : source.entrySet()) {
            if (entry.getKey() != null && entry.getValue() != null) {
                result.put(
                        entry.getKey().toString(),
                        entry.getValue().toString()
                );
            }
        }

        return result;
    }
}
