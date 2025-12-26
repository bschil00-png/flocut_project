package com.flocut.demo.domain.file.dto.response;

import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FileItemResponse {

    private Long fileId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private FileStatus status;
    private LocalDateTime regdate;

    public static FileItemResponse from(File file) {
        return new FileItemResponse(
                file.getFileId(),
                file.getFileName(),
                file.getFileType(),
                file.getFileSize(),
                file.getStatus(),
                file.getRegdate()
        );
    }
}
