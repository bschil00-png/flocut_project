package com.flocut.demo.domain.document.entity;

import com.flocut.demo.domain.file.entity.File;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_document_text")
@Getter
@NoArgsConstructor
public class DocumentText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doc_text_id")
    private Long docTextId;

    // 🔗 File 1:1
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false, unique = true)
    private File file;

    @Column(length = 30)
    private String language;

    @Column(name = "text_content", columnDefinition = "TEXT", nullable = false)
    private String textContent;

    @Column(name = "ocr_used", nullable = false)
    private Boolean ocrUsed;

    @Column(nullable = false)
    private LocalDateTime regdate;

    /* 생성 전용 */
    public static DocumentText create(
            File file,
            String language,
            String textContent,
            boolean ocrUsed
    ) {
        DocumentText t = new DocumentText();
        t.file = file;
        t.language = language;
        t.textContent = textContent;
        t.ocrUsed = ocrUsed;
        t.regdate = LocalDateTime.now();
        return t;
    }
}
