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


    // summaryId 기준 단건 조회 (COMPLETED만)
    @QueryMapping
    public DocumentSummaryViewResponse documentSummaryViewBySummaryId(
            @Argument Long summaryId
    ) {
        return queryService.getSummaryViewBySummaryId(summaryId);
    }

    // file 기준 "최신 COMPLETED 요약"
    @QueryMapping
    public DocumentSummaryViewResponse documentLatestSummaryByFile(
            @Argument Long fileId,
            @Argument Long sessionId
    ) {
        return queryService.getLatestCompletedSummaryByFile(
                fileId,
                sessionId
        );
    }

    // file + session + version 기준 조회
    @QueryMapping
    public DocumentSummaryViewResponse documentSummaryByVersion(
            @Argument Long fileId,
            @Argument Long sessionId,
            @Argument int versionNo
    ) {
        return queryService.getSummaryByVersion(
                fileId,
                sessionId,
                versionNo
        );
    }

    // 요약 히스토리 (상태 전체 노출)
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

