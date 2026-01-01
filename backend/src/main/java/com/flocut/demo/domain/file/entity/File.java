package com.flocut.demo.domain.file.entity;

import com.flocut.demo.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_file")
@Getter
@NoArgsConstructor
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long fileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "s3_key", nullable = false, length = 500)
    private String s3Key;

    @Column(name = "file_type", nullable = false, length = 50)
    private String fileType;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FileStatus status;

    private LocalDateTime regdate;
    private LocalDateTime moddate;
    private LocalDateTime deletedAt;

    public static File create(
            Member member,
            String fileName,
            String s3Key,
            String fileType,
            String mimeType,
            Long fileSize
    ) {
        File file = new File();
        file.member = member;
        file.fileName = fileName;
        file.s3Key = s3Key;
        file.fileType = fileType;
        file.mimeType = mimeType;
        file.fileSize = fileSize;
        file.status = FileStatus.UPLOADED;
        file.regdate = LocalDateTime.now();
        file.moddate = LocalDateTime.now();
        return file;
    }

    public void softDelete() {
        this.status = FileStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
        this.moddate = LocalDateTime.now();
    }
}
