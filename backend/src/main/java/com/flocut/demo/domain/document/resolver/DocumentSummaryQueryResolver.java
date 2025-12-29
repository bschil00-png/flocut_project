package com.flocut.demo.domain.document.resolver;

import com.flocut.demo.domain.document.dto.response.DocumentSummaryDetailResponse;
import com.flocut.demo.domain.document.service.DocumentSummaryQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class DocumentSummaryQueryResolver {

    private final DocumentSummaryQueryService queryService;

    /**
     * 📌 fileId 기준 최신 요약 조회 (GraphQL)
     */
    @QueryMapping
    public DocumentSummaryDetailResponse documentSummaryByFileId(
            @Argument Long fileId
    ) {
        return queryService.getLatestSummaryByFileId(fileId);
    }
}
