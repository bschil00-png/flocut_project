package com.flocut.demo.domain.ai.service;

import com.flocut.demo.domain.ai.dto.request.AiSummaryFailRequest;
import com.flocut.demo.domain.ai.dto.request.AiSummaryResultRequest;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AiSummaryCallbackService {

    private final DocumentSummaryRepository summaryRepository;

    @Transactional
    public void handleSummaryResult(AiSummaryResultRequest request) {

        DocumentSummary summary =
                summaryRepository
                        .findBySessionSessionIdAndRoundNoAndVersionNo(
                                request.getSessionId(),
                                request.getRoundNo(),
                                request.getVersionNo()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException("요약 대상 없음")
                        );

        summary.complete(
                request.getSummaryText(),
                request.getModelVersion()
        );
        summaryRepository.save(summary);
    }

    @Transactional
    public void handleSummaryFail(AiSummaryFailRequest request) {

        DocumentSummary summary =
                summaryRepository
                        .findBySessionSessionIdAndRoundNoAndVersionNo(
                                request.getSessionId(),
                                request.getRoundNo(),
                                request.getVersionNo()
                        )
                        .orElseThrow();

        summary.fail(request.getReason());
    }
}
