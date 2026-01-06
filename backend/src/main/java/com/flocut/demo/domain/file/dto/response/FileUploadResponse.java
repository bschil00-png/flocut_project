package com.flocut.demo.domain.file.dto.response;

import com.flocut.demo.domain.file.entity.FileStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FileUploadResponse {
    private Long fileId;
    private Long sessionId;
    private FileStatus status;
}
