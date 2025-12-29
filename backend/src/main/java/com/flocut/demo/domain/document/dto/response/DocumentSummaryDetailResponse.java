package com.flocut.demo.domain.document.dto.response;

import com.flocut.demo.domain.document.entity.SummaryStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DocumentSummaryDetailResponse {

    private Long summaryId;
    private Long fileId;
    private SummaryStatus status;
    private String summaryText;
    private String modelVersion;
}
