package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.document.dto.response.DocumentSummaryDetailResponse;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentSummaryQueryService {

    private final DocumentSummaryRepository summaryRepository;

    public DocumentSummaryDetailResponse getLatestSummaryByFileId(Long fileId) {

        DocumentSummary summary =
                summaryRepository
                        .findTopByFileFileIdOrderBySummaryIdDesc(fileId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("요약 정보 없음")
                        );

        return new DocumentSummaryDetailResponse(
                summary.getSummaryId(),
                summary.getFile().getFileId(),
                summary.getStatus(),
                summary.getSummaryText(),
                summary.getModelVersion()
        );
    }
}
