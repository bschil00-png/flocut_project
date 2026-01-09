package com.flocut.demo.domain.record.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RecordResponse {
    private Long recordId;
    private String content;
    private LocalDateTime createdAt;
}
