package com.flocut.demo.domain.ai.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiSummaryFailRequest {
    private Long sessionId;
    private int roundNo;
    private int versionNo;
    private String reason;
    private Long fileId;
}