//package com.flocut.demo.domain.document.entity;
//
//import com.flocut.demo.domain.file.entity.File;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "tbl_document_text")
//@Getter
//@NoArgsConstructor
//public class DocumentText {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "doc_text_id")
//    private Long docTextId;
//
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "file_id", nullable = false)
//    private File file;
//
//    @Column(length = 30)
//    private String language;
//
//    @Column(name = "text_content", columnDefinition = "TEXT", nullable = false)
//    private String textContent;
//
//    @Column(name = "ocr_used", nullable = false)
//    private Boolean ocrUsed;
//
//    @Column(nullable = false)
//    private LocalDateTime regdate;
//
//    /* ===== 생성 ===== */
//    public static DocumentText create(
//            File file,
//            String language,
//            String textContent,
//            boolean ocrUsed
//    ) {
//        DocumentText text = new DocumentText();
//        text.file = file;
//        text.language = language;
//        text.textContent = textContent;
//        text.ocrUsed = ocrUsed;
//        text.regdate = LocalDateTime.now();
//        return text;
//    }
//}
