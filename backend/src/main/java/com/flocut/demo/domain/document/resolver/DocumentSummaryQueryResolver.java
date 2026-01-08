package com.flocut.demo.domain.document.resolver;

import com.flocut.demo.domain.document.dto.response.DocumentSummaryViewResponse;
import com.flocut.demo.domain.document.service.DocumentSummaryQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class DocumentSummaryQueryResolver {

    private final DocumentSummaryQueryService queryService;


    // 🔥 summaryId 기준 조회 (노트/히스토리/상세)
    @QueryMapping
    public DocumentSummaryViewResponse documentSummaryViewBySummaryId(
            @Argument Long summaryId
    ) {
        return queryService.getSummaryViewBySummaryId(summaryId);
    }

    @QueryMapping
    public DocumentSummaryViewResponse documentLatestSummaryByFile(
            @Argument Long fileId
//            @Argument Long sessionId
    ) {
//        return queryService.getLatestSummaryViewByFile(fileId, sessionId);
        return queryService.getLatestSummaryViewByFile(fileId);
    }
}

