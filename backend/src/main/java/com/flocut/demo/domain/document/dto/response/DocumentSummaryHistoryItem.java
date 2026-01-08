package com.flocut.demo.domain.document.dto.response;

import com.flocut.demo.domain.document.entity.SummaryStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DocumentSummaryHistoryItem {
    private Long summaryId;
    private int versionNo;
    private SummaryStatus status;
    private LocalDateTime createdAt;
}
