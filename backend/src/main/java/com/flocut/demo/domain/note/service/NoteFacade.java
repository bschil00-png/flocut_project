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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Log4j2
public class NoteFacade {
    private final NoteService noteService;
    private final NoteMapper noteMapper;
    private final RedisTemplate<String, String> redisTemplate;
    private static final String INDEX_KEY = "note:buffer:index";
    private static final String CACHE_KEY_PREFIX = "note:buffer:";
    private static final int CACHE_TTL_MINUTES = 30;

    //      [목록 조회] Redis 캐시와 DB 데이터를 병합하여 반환
//      노션처럼 즉시 반영되는 느낌을 주기 위해, DB에서 페이지 데이터를 가져온 후
//      Redis에 수정 중인 내용(캐시)이 있다면 그 내용을 우선적으로
    public PageResponseDTO<NoteResponseDTO> getNotesByStatusWithCache(
            Long sessionId,
            Member member,
            CommonStatus status,
            PageRequestDTO pageRequest
    ) {
        // DB에서 기본 페이지 데이터 조회
        PageResponseDTO<Note> basePage =
                noteService.getNotesByStatus(sessionId, member, status, pageRequest);

        List<Note> notes = basePage.getContent();
        if (notes.isEmpty()) {
            return new PageResponseDTO<>(
                    new ArrayList<>(),
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

        // Redis pipelining 실행
        // 각 노트에 대해 title, lastModified를 순서대로 요청한다
        List<Object> pipelineResults =
                redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
                    for (Note note : notes) {
                        byte[] key = (CACHE_KEY_PREFIX + note.getNoteId()).getBytes();
                        connection.hashCommands().hGet(key, "title".getBytes());
                        connection.hashCommands().hGet(key, "lastModified".getBytes());
                    }
                    return null;
                });

        // DB 데이터와 Redis 캐시 병합
        List<NoteResponseDTO> merged = new ArrayList<>(notes.size());

        for (int i = 0; i < notes.size(); i++) {
            Note note = notes.get(i);
            NoteResponseDTO dto = noteMapper.toNoteResponseDTO(note);

            Object cachedTitleObj = pipelineResults.get(i * 2);
            Object lastModifiedObj = pipelineResults.get(i * 2 + 1);

            String mergedTitle =
                    cachedTitleObj != null ? cachedTitleObj.toString() : dto.title();

            String mergedModdate = dto.moddate();

            if (lastModifiedObj != null) {
                try {
                    long ms = Long.parseLong(lastModifiedObj.toString());
                    mergedModdate = Instant.ofEpochMilli(ms)
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime()
                            .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (Exception ignore) {
                }
            }

            merged.add(new NoteResponseDTO(
                    dto.noteId(),
                    dto.sessionId(),
                    mergedTitle,
                    dto.sourceType(),
                    dto.sourceId(),
                    dto.status(),
                    dto.regdate(),
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

    //     [자동 저장] 프론트엔드에서 사용자가 타이핑할 때마다 실시간으로 호출됩니다.
//     성능을 위해 DB에 바로 쓰지 않고 Redis 해시에 임시 저장합니다.
    public void autoSave(Long noteId, Member member, String title, String content) {
        // 소유권 및 권한 검증
        noteService.getNote(noteId, member);

        String key = CACHE_KEY_PREFIX + noteId;

        // Redis Hash에 제목과 내용을 각각 저장
        if (title != null) {
            redisTemplate.opsForHash().put(key, "title", title);
        }
        if (content != null) {
            redisTemplate.opsForHash().put(key, "content", content);
        }

        // 스케줄러가 추적할 수 있도록 인덱스(Set)에 해당 노트 키를 추가
        redisTemplate.opsForSet().add(INDEX_KEY, String.valueOf(noteId));

        // 마지막 수정 시간을 업데이트하여 정렬 및 동기화 기준으로 활용합
        redisTemplate.opsForHash().put(key, "lastModified", String.valueOf(System.currentTimeMillis()));

        // 캐시 만료 시간을 갱신
        redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);

        // TTL 부족 시 경고 로그 발생
        Long ttl = redisTemplate.getExpire(key, TimeUnit.MINUTES);
        if (ttl != null && ttl < 10) {
            log.warn("TTL 부족 - 즉시 동기화 요청 [noteId: {}, TTL: {}분]", noteId, ttl);
        }
    }


    //     수동 저장->  명시적으로 저장 버튼을 눌렀을 때 호출
//     Redis 데이터를 DB에 즉시 반영하고 캐시를 파기합니다.
    @Transactional
    public void sync(Long noteId, Member member) {
        String key = CACHE_KEY_PREFIX + noteId;

        // Redis에서 데이터 일괄 조회
        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);

        if (cache.isEmpty()) {
            return;
        }

        String title = (String) cache.get("title");
        String content = (String) cache.get("content");

        if (title != null || content != null) {
            NoteUpdateRequestDTO dto = new NoteUpdateRequestDTO(title, content);

            // DB 업데이트 수행
            noteService.updateNote(noteId, member, dto);

            // 동기화 완료 후 캐시 및 인덱스에서 제거
            redisTemplate.delete(key);
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
        }
    }

    //     상세 조회 Redis와 DB를 병합하여 노트를 상세 조회
//     편집 페이지 진입 시 가장 최신 상태 (레디스)
    public NoteDetailResponseDTO getNoteWithCache(Long noteId, Member member) {
        // DB에서 기본 데이터 조회
        Note note = noteService.getNote(noteId, member);

        String key = CACHE_KEY_PREFIX + noteId;
        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);

        // 캐시가 비어있으면 DB 데이터를 그대로 반환
        if (cache.isEmpty()) {
            return noteMapper.toNoteDetailResponseDTO(note);
        }

        // 캐시 데이터가 있다면 DB 데이터 위에 Redis 내용을 덮어씌웁니다.
        String cachedTitle = (String) cache.get("title");
        String cachedContent = (String) cache.get("content");

        NoteDetailResponseDTO baseDto = noteMapper.toNoteDetailResponseDTO(note);

        return new NoteDetailResponseDTO(
                baseDto.noteId(),
                baseDto.sessionId(),
                cachedTitle != null ? cachedTitle : baseDto.title(),
                cachedContent != null ? cachedContent : baseDto.content(),
                baseDto.sourceType(),
                baseDto.sourceId(),
                baseDto.summaryOption(),
                baseDto.status(),
                baseDto.regdate(),
                baseDto.moddate()
        );
    }

    //     시스템 동기화 스케줄러 용 노트 저장 메서드 (5분 주기)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void systemSync(Long noteId) {
        String key = CACHE_KEY_PREFIX + noteId;

        Object lastModifiedObj = redisTemplate.opsForHash().get(key, "lastModified");
        if (lastModifiedObj == null) {
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
            return;
        }

        long lastModified = Long.parseLong(lastModifiedObj.toString());
        long elapsed = System.currentTimeMillis() - lastModified;

        // 마지막 수정 후 5분이 지나지 않았다면 동기화 대상에서 제외
        if (elapsed < 300_000) {
            return;
        }

        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);
        if (cache.isEmpty()) {
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
            return;
        }

        String title = (String) cache.get("title");
        String content = (String) cache.get("content");

        // 저장할 데이터가 없는 경우 인덱스에서 제거
        if (title == null && content == null) {
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
            return;
        }

        // 시스템 권한으로 DB 동기화
        noteService.updateNoteSystem(noteId, new NoteUpdateRequestDTO(title, content));

        // 동기화 완료 후 인덱스에서는 제거, 캐시는 유지 (편집 재개 대비)
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
        redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
    }

    public void clearCache(Long noteId) {
        String key = CACHE_KEY_PREFIX + noteId;
        redisTemplate.delete(key);
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
    }

    public boolean hasCachedData(Long noteId) {
        String key = CACHE_KEY_PREFIX + noteId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    @Transactional
    public void moveNoteWithCache(Long noteId, Long targetSessionId, Member member) {
        // 이동 전에 현재 편집 중인 캐시 내용을 DB에 먼저 동기화합니다.
        this.sync(noteId, member);

        // 실제 DB 상의 세션 이동 처리
        noteService.moveNote(noteId, targetSessionId, member);
        log.info("노트 이동 완료: noteId={}, targetSessionId={}", noteId, targetSessionId);
    }
}