package com.flocut.demo.domain.note.repository;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.note.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // 특정 세션 내에서 사용자의 노트 상태 조회
    Page<Note> findBySession_SessionIdAndMember_MemberIdAndStatus(
            Long sessionId,
            Long memberId,
            CommonStatus status,
            Pageable pageable
    );
//    List<Note> findBySession_SessionIdAndMember_MemberIdAndStatus(
//            Long sessionId, Long memberId, CommonStatus status
//    );

    // 단건 조회 시 상태와 소유권을 동시에 확인하기 위한 메서드
    Optional<Note> findByNoteIdAndMember_MemberId(Long noteId, Long memberId);

    // 스케줄러 전용: 시스템 전체에서 30일 지난 삭제 데이터 찾기
    List<Note> findByStatusAndDeletedAtBefore(CommonStatus status, LocalDateTime dateTime);
}

