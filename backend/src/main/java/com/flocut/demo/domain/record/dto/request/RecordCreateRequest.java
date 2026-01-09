package com.flocut.demo.domain.record.dto.request;

import lombok.Getter;

@Getter
public class RecordCreateRequest {
    private Long sessionId;
    private String content;
}
