package com.flocut.demo.domain.note.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Log4j2
public class NoteAutoSyncScheduler {

    private final NoteFacade noteFacade;
    private final RedisTemplate<String, String> redisTemplate;

    // Redis에 저장된 자동저장 노트 ID들을 추적하는 Set 키
    private static final String INDEX_KEY = "note:buffer:index";

    // 5분마다 실행
    @Scheduled(fixedDelay = 1000 * 60 * 5)
    public void autoSyncToDb() {

        //  보안 컨텍스트 초기화 (스케줄러 스레드 안전성 보장)
        SecurityContextHolder.clearContext();

        //  동기화 대상 목록 조회
        // RedisTemplate<String, String> 설정에 따라 StringSerializer가 적용
        Set<String> noteIds = redisTemplate.opsForSet().members(INDEX_KEY);

        if (noteIds == null || noteIds.isEmpty()) {
            return;
        }

        log.info("[Scheduler] 정기 자동 동기화 시작: {}건", noteIds.size());

        for (String noteIdStr : noteIds) {
            try {
                Long noteId = Long.parseLong(noteIdStr);

                // 캐시 존재 여부 확인
                // TTL 만료 등으로 데이터가 사라졌다면 인덱스에서도 삭제
                if (!noteFacade.hasCachedData(noteId)) {
                    log.info("[Scheduler] 캐시 만료로 인한 인덱스 제거: NoteID={}", noteId);
                    redisTemplate.opsForSet().remove(INDEX_KEY, noteIdStr);
                    continue;
                }

                // DB 반영 실행
                // NoteFacade 내에서 StringSerializer를 사용하여 안전하게 데이터를 읽어 DB에 저장
                noteFacade.systemSync(noteId);

                log.info("[Scheduler] 동기화 완료: NoteID={}", noteId);

            } catch (NumberFormatException e) {
                log.error("[Scheduler] 잘못된 ID 형식 발견: {}", noteIdStr);
                redisTemplate.opsForSet().remove(INDEX_KEY, noteIdStr);
            } catch (Exception e) {
                log.error("[Scheduler] 동기화 중 오류 발생 [NoteID: {}]: {}", noteIdStr, e.getMessage());
            }
        }

        log.info("[Scheduler] 정기 자동 동기화 종료");
    }
}