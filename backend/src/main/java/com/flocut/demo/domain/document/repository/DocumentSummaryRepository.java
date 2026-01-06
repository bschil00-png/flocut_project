//package com.flocut.demo.domain.document.repository;
//
//import com.flocut.demo.domain.document.entity.DocumentSummary;
//import org.springframework.data.repository.query.Param;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//
//import java.util.Optional;
//
//public interface DocumentSummaryRepository
//        extends JpaRepository<DocumentSummary, Long> {
//
//    Optional<DocumentSummary>
//    findTopByFileFileIdOrderBySummaryIdDesc(Long fileId);
//
//    @Query("""
//    SELECT ds
//    FROM DocumentSummary ds
//    WHERE ds.file.fileId = :fileId
//      AND ds.session.sessionId = :sessionId
//      AND ds.versionNo = :versionNo
//      AND ds.roundNo = :roundNo
//""")
//    Optional<DocumentSummary>
//    findByFileFileIdAndSessionSessionIdAndVersionNo(
////    findByFileIdAndSessionIdAndRoundNoAndVersionNo(
//
//            @Param("fileId") Long fileId,
//            @Param("sessionId") Long sessionId,
////            @Param("roundNo") int roundNo,
//            @Param("versionNo") int versionNo
//    );
//
//    @Query("""
//    SELECT MAX(ds.versionNo)
//    FROM DocumentSummary ds
//    WHERE ds.file.fileId = :fileId
//      AND ds.session.sessionId = :sessionId
////      AND ds.roundNo = :roundNo
//""")
//    Integer findMaxVersionNo(
//            @Param("fileId") Long fileId,
//            @Param("sessionId") Long sessionId
////            @Param("roundNo") int roundNo
//    );
//}

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
    WHERE ds.file.fileId = :fileId
      AND ds.session.sessionId = :sessionId
      AND ds.versionNo = :versionNo
""")
    Optional<DocumentSummary>
    findByFileFileIdAndSessionSessionIdAndVersionNo(

            @Param("fileId") Long fileId,
            @Param("sessionId") Long sessionId,
            @Param("versionNo") int versionNo
    );

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
}