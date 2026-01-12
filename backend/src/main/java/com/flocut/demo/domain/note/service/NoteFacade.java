package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.mapper.NoteMapper;
import com.flocut.demo.domain.record.entity.RecordFile;
import com.flocut.demo.domain.record.repository.RecordFileRepository;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Log4j2
public class NoteFacade {

    private final NoteService noteService;
    private final NoteMapper noteMapper;
    private final RedisTemplate<String, String> redisTemplate;
    private final RecordFileRepository recordRepository;
    private final MemberRepository memberRepository;

    private static final String CACHE_KEY_PREFIX = "note:buffer:";
    private static final String INDEX_KEY = "note:buffer:index";
    private static final int CACHE_TTL_MINUTES = 60;

    private String getCacheKey(Long noteId) {
        return CACHE_KEY_PREFIX + noteId;
    }

    // 목록 조회
    public PageResponseDTO<NoteResponseDTO> getNotesByStatusWithCache(
            Long sessionId, Member member, CommonStatus status, PageRequestDTO pageRequest
    ) {
        PageResponseDTO<Note> basePage = noteService.getNotesByStatus(sessionId, member, status, pageRequest);
        List<Note> notes = basePage.getContent();

        if (notes.isEmpty()) {
            return new PageResponseDTO<>(new ArrayList<>(), basePage.getTotalElements(), basePage.getTotalPages(),
                    basePage.getPageNumber(), basePage.getPageSize(), basePage.isHasNext(),
                    basePage.isHasPrevious(), basePage.isFirst(), basePage.isLast());
        }

        List<NoteResponseDTO> merged = new ArrayList<>();

        for (Note note : notes) {
            NoteResponseDTO base = noteMapper.toNoteResponseDTO(note);
            String key = getCacheKey(note.getNoteId());

            String cachedTitle = null;
            String cachedModified = null;

            try {
                // Pipeline 대신 직접 opsForHash로 하나씩 조회
                Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
                if (entries != null && !entries.isEmpty()) {
                    cachedTitle = (String) entries.get("title");
                    cachedModified = (String) entries.get("lastModified");
                }
            } catch (Exception e) {
                log.error("Redis 조회 중 에러 발생 (ID: {}): {}", note.getNoteId(), e.getMessage());
            }

            if (cachedTitle != null) {
                log.info("  NoteID: {}, Title: {}", note.getNoteId(), cachedTitle);
            }

            String mergedModdate = base.moddate();
            if (cachedModified != null) {
                try {
                    mergedModdate = Instant.ofEpochMilli(Long.parseLong(cachedModified))
                            .atZone(ZoneId.systemDefault()).toLocalDateTime()
                            .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (Exception ignore) {}
            }

            merged.add(new NoteResponseDTO(
                    base.noteId(), base.sessionId(),
                    (cachedTitle != null && !cachedTitle.isBlank()) ? cachedTitle : base.title(),
                    base.sourceType(), base.sourceId(), base.status(), base.regdate(), mergedModdate
            ));
        }

        return new PageResponseDTO<>(merged, basePage.getTotalElements(), basePage.getTotalPages(),
                basePage.getPageNumber(), basePage.getPageSize(), basePage.isHasNext(),
                basePage.isHasPrevious(), basePage.isFirst(), basePage.isLast());
    }

    //  자동 저장 (동일한 opsForHash 사용)
    public void autoSave(Long noteId, Member member, String title, String content) {
        noteService.getNote(noteId, member);

        String key = getCacheKey(noteId);
        String now = String.valueOf(System.currentTimeMillis());

        try {
            if (title != null) redisTemplate.opsForHash().put(key, "title", title);
            if (content != null) redisTemplate.opsForHash().put(key, "content", content);
            redisTemplate.opsForHash().put(key, "lastModified", now);
            redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
            redisTemplate.opsForSet().add(INDEX_KEY, String.valueOf(noteId));
            log.info("[autoSave] Redis 저장 완료: ID={}, Title={}", noteId, title);
        } catch (Exception e) {
            log.error("[autoSave Error] ID={}: {}", noteId, e.getMessage());
        }
    }

    //  상세 조회 (수정 중인 내용 포함)
    public NoteDetailResponseDTO getNoteWithCache(Long noteId, Member member) {
        Note note = noteService.getNote(noteId, member);
        String key = getCacheKey(noteId);

        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);

        if (cache == null || cache.isEmpty()) {
            return noteMapper.toNoteDetailResponseDTO(note);
        }

        NoteDetailResponseDTO base = noteMapper.toNoteDetailResponseDTO(note);
        return new NoteDetailResponseDTO(
                base.noteId(), base.sessionId(),
                (String) cache.getOrDefault("title", base.title()),
                (String) cache.getOrDefault("content", base.content()),
                base.sourceType(), base.sourceId(), base.summaryOption(),
                base.status(), base.regdate(), base.moddate()
        );
    }

    @Transactional
    public void sync(Long noteId, Member member) {
        NoteDetailResponseDTO cached = getNoteWithCache(noteId, member);
        if (!hasCachedData(noteId)) return;
        noteService.updateNote(noteId, member, new NoteUpdateRequestDTO(cached.title(), cached.content()));
        clearCache(noteId);
        log.info("[Sync] DB 반영 완료: ID={}", noteId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void systemSync(Long noteId) {
        String key = getCacheKey(noteId);
        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);
        if (cache == null || cache.isEmpty()) {
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
            return;
        }
        noteService.updateNoteSystem(noteId, new NoteUpdateRequestDTO((String)cache.get("title"), (String)cache.get("content")));
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
    }

    public void clearCache(Long noteId) {
        redisTemplate.delete(getCacheKey(noteId));
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
    }

    public boolean hasCachedData(Long noteId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(getCacheKey(noteId)));
    }

    @Transactional
    public void moveNoteWithCache(Long noteId, Long targetSessionId, Member member) {
        this.sync(noteId, member);
        noteService.moveNote(noteId, targetSessionId, member);
    }

    @Transactional
    public void appendRecordsToNote(Long noteId, Long sessionId, Member member) {
        this.sync(noteId, member);
        List<RecordFile> records = recordRepository.findBySession_SessionIdOrderByCreatedAtAsc(sessionId);
        if (records.isEmpty()) return;
        String fullSpeechText = records.stream().map(RecordFile::getContent).collect(Collectors.joining(" "));
        Note note = noteService.getNote(noteId, member);
        StringBuilder sb = new StringBuilder();
        if (note.getContent() != null && !note.getContent().isBlank()) sb.append(note.getContent()).append("\n\n");
        sb.append("--- [음성 녹음 데이터 반영] ---\n").append(fullSpeechText);
        noteService.updateNote(noteId, member, new NoteUpdateRequestDTO(null, sb.toString()));
        recordRepository.deleteByRecordIdInAndMemberMemberId(records.stream().map(RecordFile::getRecordId).toList(), member.getMemberId());
        this.clearCache(noteId);
    }

    public void appendSingleRecordToNote(Long noteId, String newText, Long memberId) {
        Member member = memberRepository.getReferenceById(memberId);
        NoteDetailResponseDTO current = getNoteWithCache(noteId, member);
        String updatedContent = (current.content() == null ? "" : current.content()) + " " + newText;
        autoSave(noteId, member, current.title(), updatedContent);
    }
}