package com.flocut.demo.domain.document.repository;

import com.flocut.demo.domain.document.entity.DocumentSummary;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DocumentSummaryRepository
        extends JpaRepository<DocumentSummary, Long> {

    Optional<DocumentSummary>
    findTopByFileFileIdOrderBySummaryIdDesc(Long fileId);

    @Query("""
        SELECT ds
        FROM DocumentSummary ds
        WHERE ds.session.sessionId = :sessionId
          AND ds.roundNo = :roundNo
          AND ds.versionNo = :versionNo
    """)
    Optional<DocumentSummary>
    findBySessionSessionIdAndRoundNoAndVersionNo(
            @Param("sessionId") Long sessionId,
            @Param("roundNo") int roundNo,
            @Param("versionNo") int versionNo
    );
}