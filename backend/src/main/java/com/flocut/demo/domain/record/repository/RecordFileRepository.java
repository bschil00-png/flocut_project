package com.flocut.demo.domain.record.repository;

import com.flocut.demo.domain.record.entity.RecordFile; // 명시적 import
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecordFileRepository
        extends JpaRepository<RecordFile, Long> { // Record -> RecordFile 변경

    // 세션별 리스트 조회
    List<RecordFile> findBySession_SessionIdOrderByCreatedAtAsc(Long sessionId);
    // 세션 및 회원별 페이지네이션 조회
    Page<RecordFile> findBySessionSessionIdAndSessionMemberMemberIdOrderByCreatedAtDesc(
            Long sessionId,
            Long memberId,
            Pageable pageable
    );

    // 다중 삭제: RecordId -> RecordFileId로 명칭 변경
    int deleteByRecordIdInAndMemberMemberId(
            List<Long> recordIds,
            Long memberId
    );

    // 단건 조회: RecordId -> RecordFileId로 명칭 변경
    Optional<RecordFile> findByRecordIdAndMemberMemberId(
            Long recordId,
            Long memberId
    );
}
