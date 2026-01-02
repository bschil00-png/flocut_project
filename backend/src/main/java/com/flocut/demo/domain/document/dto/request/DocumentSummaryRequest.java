package com.flocut.demo.domain.document.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentSummaryRequest {
    private Long fileId;
    private Long sessionId;
    private int roundNo;

}
