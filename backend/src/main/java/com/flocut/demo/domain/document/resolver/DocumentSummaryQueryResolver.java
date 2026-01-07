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

    @QueryMapping
    public DocumentSummaryViewResponse documentSummaryViewByFileId(
            @Argument Long fileId
    ) {
        return queryService.getLatestSummaryViewByFileId(fileId);
    }
}

