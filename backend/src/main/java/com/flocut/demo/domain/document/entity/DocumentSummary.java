//package com.flocut.demo.domain.document.entity;
//
//import com.flocut.demo.domain.file.entity.File;
//import com.flocut.demo.domain.session.entity.Session;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(
//        name = "tbl_document_summary",
//        uniqueConstraints = {
//                @UniqueConstraint(
//                        columnNames = {"session_id", "round_no", "version_no"}
//                )
//        }
//)
//@Getter
//@NoArgsConstructor
//public class DocumentSummary {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "summary_id")
//    private Long summaryId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "file_id", nullable = false)
//    private File file;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "session_id", nullable = false)
//    private Session session;
//
//    @Column(name = "round_no", nullable = false)
//    private Integer roundNo;
//
//    @Column(name = "version_no", nullable = false)
//    private Integer versionNo;
//
//    @Column(name = "summary_text", columnDefinition = "TEXT", nullable = false)
//    private String summaryText;
//
//    @Column(name = "summary_option", length = 50)
//    private String summaryOption;
//
//    @Column(name = "summary_topic", length = 255)
//    private String summaryTopic;
//
//    @Column(name = "model_version", length = 50)
//    private String modelVersion;
//
//    @Column(name = "deleted_at")
//    private LocalDateTime deletedAt;
//
//    @Column(nullable = false)
//    private LocalDateTime regdate;
//
//    /* ===== 생성 ===== */
//    public static DocumentSummary create(
//            File file,
//            Session session,
//            int roundNo,
//            int versionNo,
//            String summaryText,
//            String modelVersion
//    ) {
//        DocumentSummary s = new DocumentSummary();
//        s.file = file;
//        s.session = session;
//        s.roundNo = roundNo;
//        s.versionNo = versionNo;
//        s.summaryText = summaryText;
//        s.modelVersion = modelVersion;
//        s.regdate = LocalDateTime.now();
//        return s;
//    }
//
//    public void softDelete() {
//        this.deletedAt = LocalDateTime.now();
//    }
//}
