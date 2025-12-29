package com.flocut.demo.domain.ai.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiSummaryResultRequest {

    private Long fileId;
    private Long sessionId;
    private int roundNo;
    private int versionNo;

    private String summaryText;
    private String modelVersion;
}
