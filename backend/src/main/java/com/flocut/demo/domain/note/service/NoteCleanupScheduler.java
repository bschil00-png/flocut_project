package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.repository.NoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NoteCleanupScheduler {
    private final NoteRepository noteRepository;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정 실행
    @Transactional
    public void cleanupOldNotes() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);

        //  30일이 지난 DELETED 상태의 노트를 조회
        List<Note> expiredNotes = noteRepository.findByStatusAndDeletedAtBefore(
                CommonStatus.DELETED,
                threshold
        );

        // 일괄 삭제 (JPA deleteAll 또는 별도 쿼리)
        if (!expiredNotes.isEmpty()) {
            noteRepository.deleteAll(expiredNotes);
            System.out.println("Hard Delete 실행: " + expiredNotes.size() + "개의 노트가 영구 삭제되었습니다.");
        }
    }
}