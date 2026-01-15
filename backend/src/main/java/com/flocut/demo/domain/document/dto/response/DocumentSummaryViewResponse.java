package com.flocut.demo.domain.document.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DocumentSummaryViewResponse {

    private Long summaryId;
    private String status;
    private String mainTopic;
    private List<String> keyTakeaways;
    private List<SectionResponse> sections;
    private String finalDocument;

    @Getter
    @Builder
    public static class SectionResponse {
        private String title;
        private String content;
    }
}
