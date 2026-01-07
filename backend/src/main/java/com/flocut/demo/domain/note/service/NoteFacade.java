package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.mapper.NoteMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

    //   목록 조회(레디스 + 디비 병합)
    public List<NoteResponseDTO> getNotesByStatusWithCache(Long sessionId, Member member, CommonStatus status) {
        List<Note> notes = noteService.getNotesByStatus(sessionId, member, status);
        List<NoteResponseDTO> baseList = noteMapper.toNoteResponseDTOList(notes);

        List<NoteResponseDTO> merged = new ArrayList<>(baseList.size());

        for (NoteResponseDTO dto : baseList) {
            Long noteId = dto.noteId();
            String key = CACHE_KEY_PREFIX + noteId;

            // Redis에서 최신 title / lastModified 확인
            Object cachedTitleObj = redisTemplate.opsForHash().get(key, "title");
            Object lastModifiedObj = redisTemplate.opsForHash().get(key, "lastModified");

            String mergedTitle = (cachedTitleObj != null) ? cachedTitleObj.toString() : dto.title();
            String mergedModdate = dto.moddate();

            // 리스트에서 "최근 수정"을 Redis 기준으로 보여주고 싶으면 lastModified로 moddate 덮어쓰기
            if (lastModifiedObj != null) {
                try {
                    long ms = Long.parseLong(lastModifiedObj.toString());
                    mergedModdate = Instant.ofEpochMilli(ms)
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime()
                            .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (Exception ignore) {
                    // 변환 실패 시 기존 DB moddate 유지
                }
            }

            // Record라 새로 생성해서 덮어쓰기
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

        return merged;
    }

    // 자동저장 (프론트에서 타이핑 할때마다 호출)
    public void autoSave(Long noteId, Member member, String title, String content) {
        // 권한 검증
        noteService.getNote(noteId, member);

        // Redis 키 생성
        String key = CACHE_KEY_PREFIX + noteId;

        // Redis hash에 저장
        if (title != null) {
            redisTemplate.opsForHash().put(key, "title", title);
        }
        if (content != null) {
            redisTemplate.opsForHash().put(key, "content", content);
        }

        // 관리 인덱스(Set)에 해당 노트 키 추가
        redisTemplate.opsForSet().add(INDEX_KEY, String.valueOf(noteId));

        redisTemplate.opsForHash().put(key, "lastModified", String.valueOf(System.currentTimeMillis()));

        // TTL 갱신
        redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);

        // TTL 체크
        Long ttl = redisTemplate.getExpire(key, TimeUnit.MINUTES);
        if (ttl != null && ttl < 10) {
            log.warn("TTL 부족 - 즉시 동기화 요청 [noteId: {}, TTL: {}분]", noteId, ttl);
        }
    }

    // DB 동기화 (저장 버튼 클릭시)
    @Transactional
    public void sync(Long noteId, Member member) {
        String key = CACHE_KEY_PREFIX + noteId;

        // Redis에서 데이터 조회
        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);

        // 캐시가 비어있으면 동기화할 것이 없음
        if (cache.isEmpty()) {
            return;
        }

        // title, content 추출
        String title = (String) cache.get("title");
        String content = (String) cache.get("content");

        // DTO 생성(제목이나 내용 둘중에 하나라도 있으면 DTO 생성 가능)
        if (title != null || content != null) {
            NoteUpdateRequestDTO dto = new NoteUpdateRequestDTO(title, content);

            // DB 반영
            noteService.updateNote(noteId, member, dto);

            // 반영 후에 Redis 및 인덱스에서 제거
            redisTemplate.delete(key);
            redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
        }
    }

    // 노트 조회 (Redis + DB 병합)
    public NoteDetailResponseDTO getNoteWithCache(Long noteId, Member member) {
        // DB에서 기본 데이터 조회
        Note note = noteService.getNote(noteId, member);

        // Redis 키 생성
        String key = CACHE_KEY_PREFIX + noteId;
        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);

        // 캐시가 비어있으면 DB 데이터를 MapStruct로 변환해서 반환
        if (cache.isEmpty()) {
            return noteMapper.toNoteDetailResponseDTO(note);
        }

        // Redis에서 title, content만 가져오기
        String cachedTitle = (String) cache.get("title");
        String cachedContent = (String) cache.get("content");

        // MapStruct 사용하되, Redis 우선 적용
        // MapStruct로 기본 변환 후 Redis 데이터로 덮어쓰기
        NoteDetailResponseDTO baseDto = noteMapper.toNoteDetailResponseDTO(note);

        // Redis 우선 적용된 새 DTO 생성 (Record 타입이라 새 객체 생성 필요)
        return new NoteDetailResponseDTO(
                baseDto.noteId(),
                baseDto.sessionId(),
                cachedTitle != null ? cachedTitle : baseDto.title(),
                cachedContent != null ? cachedContent : baseDto.content(),
                baseDto.sourceType(),
                baseDto.sourceId(),
                baseDto.status(),
                baseDto.regdate(),
                baseDto.moddate()
        );
    }

    // 캐시 관리 (노트 삭제시 Redis 캐시도 함께 삭제)
    public void clearCache(Long noteId) {
        String key = CACHE_KEY_PREFIX + noteId;
        redisTemplate.delete(key);
        redisTemplate.opsForSet().remove(INDEX_KEY, String.valueOf(noteId));
    }

    // Redis 존재 여부 확인
    public boolean hasCachedData(Long noteId) {
        String key = CACHE_KEY_PREFIX + noteId;
        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);
        return !cache.isEmpty();
    }

    // 시스템용 동기화 메서드 (스케줄러에서 사용)
    // 시스템 자동 동기화용 트랜잭션
    // 기존 요청 트랜잭션과 분리하여 독립적으로 실행하기 위해 REQUIRES_NEW 사용
    // 사용자 요청, SecurityContext, OpenSessionInView와 무관하게 동작해야 함
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void systemSync(Long noteId) {
        String key = CACHE_KEY_PREFIX + noteId;

        // 마지막 수정 시간 확인
        Object lastModifiedObj = redisTemplate.opsForHash().get(key, "lastModified");
        if (lastModifiedObj == null) return;

        Long lastModified = Long.parseLong(lastModifiedObj.toString());
        Long elapsed = System.currentTimeMillis() - lastModified;

        // 5분 이상 수정 없었을때만 동기화
        if (elapsed < 300000) {
            log.debug("최근 수정됨 - 동기화 스킵 [noteId: {}]", noteId);
            return;
        }

        Map<Object, Object> cache = redisTemplate.opsForHash().entries(key);
        if (cache.isEmpty()) return;

        String title = (String) cache.get("title");
        String content = (String) cache.get("content");

        if (title == null && content == null) return;

        // Member 없이 시스템 권한으로 업데이트
        noteService.updateNoteSystem(noteId, new NoteUpdateRequestDTO(title, content));

        // 동기화 후에도 캐시 유지 (TTL만 갱신)
        redisTemplate.expire(key, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
        log.info("시스템 자동 동기화 완료 [noteId: {}]", noteId);
    }

    // 노트 이동
    @Transactional
    public void moveNoteWithCache(Long noteId, Long targetSessionId, Member member) {
        // 이동 전에 현재 캐시에 있는 내용을 DB에 먼저 반영
        this.sync(noteId, member);

        // 실제 DB 이동 로직 수행
        noteService.moveNote(noteId, targetSessionId, member);
        log.info("노트 이동 완료: noteId={}, targetSessionId={}", noteId, targetSessionId);
    }
}