package com.flocut.demo.domain.document.resolver;

import com.flocut.demo.domain.document.dto.response.DocumentSummaryHistoryItem;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryViewResponse;
import com.flocut.demo.domain.document.service.DocumentSummaryQueryService;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

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
//  file 기준조회
    @QueryMapping
    public DocumentSummaryViewResponse documentLatestSummaryByFile(
            @Argument Long fileId
//            @Argument Long sessionId
    ) {
//        return queryService.getLatestSummaryViewByFile(fileId, sessionId);
        return queryService.getLatestSummaryViewByFile(fileId);
    }
//  file, sessionm version 기준조회
    @QueryMapping
    public DocumentSummaryViewResponse documentSummaryByVersion(
            @Argument Long fileId,
            @Argument Long sessionId,
            @Argument int versionNo
    ) {
        return queryService.getSummaryByVersion(fileId, sessionId, versionNo);
    }

    @QueryMapping
    public PageResponseDTO<DocumentSummaryHistoryItem> documentSummaryHistory(
            @Argument Long fileId,
            @Argument Long sessionId,
            @Argument PageRequestDTO page
    ) {
        return queryService.getSummaryHistory(
                fileId,
                sessionId,
                page
        );
    }
}

