package com.flocut.demo.domain.note.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Log4j2
public class NoteAutoSyncScheduler {

    // 노트 Redis + DB 병합 로직을 담당하는 Facade
    // 시스템 스케줄러에서는 사용자 인증 정보를 절대 사용하지 않는다
    private final NoteFacade noteFacade;

    // 자동 저장된 노트 ID를 관리하는 Redis 인덱스용 Set 접근
    private final RedisTemplate<String, String> redisTemplate;

    // Redis에 저장된 자동저장 노트 ID 인덱스 키
    // note:buffer:{noteId} 와 함께 사용된다
    private static final String INDEX_KEY = "note:buffer:index";

    // 5분마다 Redis에 저장된 자동저장 데이터를 DB로 동기화한다
    // 이 메서드는 사용자 요청 스레드가 아닌 Scheduler 스레드에서 실행된다
    @Scheduled(fixedDelay = 1000 * 60 * 5)
    public void autoSyncToDb() {

        // Scheduler 스레드에서는 SecurityContext가 없어야 정상이다
        // 혹시라도 이전 요청의 인증 정보가 남아 있는 경우를 방지하기 위해
        // 실행 시작 시점에 SecurityContext를 명시적으로 제거한다
        SecurityContextHolder.clearContext();

        // Redis Set에 저장된 자동저장 대상 노트 ID 목록 조회
        Set<String> noteIds = redisTemplate.opsForSet().members(INDEX_KEY);

        // 동기화 대상이 없으면 즉시 종료
        if (noteIds == null || noteIds.isEmpty()) return;

        log.info("정기 자동 동기화 시작: {}건", noteIds.size());

        // Redis 인덱스에 등록된 노트 ID를 순회하며 동기화 수행
        for (String noteIdStr : noteIds) {
            try {
                // Redis에 저장된 noteId는 문자열이므로 Long으로 변환
                Long noteId = Long.parseLong(noteIdStr);

                // 해당 노트에 대한 Redis 캐시가 실제로 존재하는지 확인
                // TTL 만료 등으로 캐시가 사라졌다면 인덱스에서도 제거한다
                if (!noteFacade.hasCachedData(noteId)) {
                    redisTemplate.opsForSet()
                            .remove(INDEX_KEY, noteIdStr);
                    continue;
                }

                // Redis에 저장된 데이터를 DB로 반영하는 시스템 전용 동기화 로직 호출
                // 이 로직에서는 인증 정보나 사용자 권한을 절대 사용하지 않는다
                noteFacade.systemSync(noteId);

            } catch (Exception e) {
                // 개별 노트 동기화 중 오류가 발생하더라도
                // 전체 스케줄러 실행이 중단되지 않도록 예외를 잡아 로그만 남긴다
                log.error(
                        "자동 동기화 중 오류 발생 [noteId: {}]: {}",
                        noteIdStr,
                        e.getMessage()
                );
            }
        }
    }
}
