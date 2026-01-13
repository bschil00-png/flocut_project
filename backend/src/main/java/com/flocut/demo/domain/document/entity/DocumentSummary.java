package com.flocut.demo.domain.document.entity;

import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.session.entity.Session;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tbl_document_summary")
public class DocumentSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long summaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;


    @Column(name = "version_no", nullable = false)
    private int versionNo;

    @Column(name = "summary_text", columnDefinition = "TEXT", nullable = false)
    private String summaryText;

    @Column(name = "summary_option", columnDefinition = "jsonb")
    @Type(JsonBinaryType.class)
    private String summaryOption;

    @Column(name = "summary_topic", length = 255)
    private String summaryTopic;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(nullable = false)
    private LocalDateTime regdate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SummaryStatus status;


    public static DocumentSummary create(
            File file,
            Session session,
            int versionNo
    ) {
        DocumentSummary s = new DocumentSummary();
        s.file = file;
        s.session = session;
        s.versionNo = versionNo;
        s.status = SummaryStatus.REQUESTED;
        s.regdate = LocalDateTime.now();
        return s;
    }

    public void complete(
            String summaryText,
            String modelVersion,
            String summaryOption
    ) {
        this.summaryText = summaryText;
        this.summaryOption = summaryOption;
        this.modelVersion = modelVersion;
        this.status = SummaryStatus.COMPLETED;
    }

    public void fail(String reason) {
        this.summaryText = reason;
        this.status = SummaryStatus.FAILED;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void changeStatus(SummaryStatus status) {
        this.status = status;
    }

}
