package com.flocut.demo.domain.document.repository;

import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.entity.SummaryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DocumentSummaryRepository
        extends JpaRepository<DocumentSummary, Long> {

    // summaryId + 상태 단건 조회 (상세용)
    Optional<DocumentSummary> findBySummaryIdAndStatus(
            Long summaryId,
            SummaryStatus status
    );

    // file + session + version 조회 (DELETED 제외 )
    @Query("""
        SELECT ds
        FROM DocumentSummary ds
        WHERE ds.file.fileId = :fileId
          AND ds.session.sessionId = :sessionId
          AND ds.versionNo = :versionNo
          AND ds.status <> 'DELETED'
    """)
    Optional<DocumentSummary> findByFileFileIdAndSessionSessionIdAndVersionNo(
            @Param("fileId") Long fileId,
            @Param("sessionId") Long sessionId,
            @Param("versionNo") int versionNo
    );

    // version 증가용
    @Query("""
        SELECT MAX(ds.versionNo)
        FROM DocumentSummary ds
        WHERE ds.file.fileId = :fileId
          AND ds.session.sessionId = :sessionId
    """)
    Integer findMaxVersionNo(
            @Param("fileId") Long fileId,
            @Param("sessionId") Long sessionId
    );

    //  히스토리 조회 (DELETED 제외)
    Page<DocumentSummary>
    findByFileFileIdAndSessionSessionIdAndStatusNot(
            Long fileId,
            Long sessionId,
            SummaryStatus status,
            Pageable pageable
    );

    // 최신 COMPLETED 요약
    @Query("""
        SELECT ds
        FROM DocumentSummary ds
        WHERE ds.file.fileId = :fileId
          AND ds.session.sessionId = :sessionId
          AND ds.status = :status
        ORDER BY ds.versionNo DESC
    """)
    Optional<DocumentSummary> findLatestByFileAndSessionAndStatus(
            @Param("fileId") Long fileId,
            @Param("sessionId") Long sessionId,
            @Param("status") SummaryStatus status
    );

}
