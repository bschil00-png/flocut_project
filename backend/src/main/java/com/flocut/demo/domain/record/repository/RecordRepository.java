package com.flocut.demo.domain.record.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.flocut.demo.domain.record.entity.Record;

import java.util.List;
import java.util.Optional;


public interface RecordRepository
        extends JpaRepository<Record, Long> {

    Page<Record> findBySessionSessionIdAndSessionMemberMemberIdOrderByCreatedAtDesc(
            Long sessionId,
            Long memberId,
            Pageable pageable
    );

    int deleteByRecordIdInAndMemberMemberId(
            List<Long> recordIds,
            Long memberId
    );
//    void deleteByRecordIdAndMemberMemberId(Long recordId, Long memberId);


    Optional<Record> findByRecordIdAndMemberMemberId(
            Long recordId,
            Long memberId
    );

}
