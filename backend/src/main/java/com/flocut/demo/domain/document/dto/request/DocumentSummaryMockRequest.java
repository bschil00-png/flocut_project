package com.flocut.demo.domain.document.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentSummaryMockRequest {
    private Long fileId;
    private Long sessionId;
    private int roundNo;
    private int versionNo;
}
