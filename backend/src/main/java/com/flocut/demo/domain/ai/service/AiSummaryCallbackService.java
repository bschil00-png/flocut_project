package com.flocut.demo.domain.ai.service;

import com.flocut.demo.domain.ai.dto.request.AiSummaryFailRequest;
import com.flocut.demo.domain.ai.dto.request.AiSummaryResultRequest;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import com.flocut.demo.domain.document.service.SummaryOptionBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AiSummaryCallbackService {

    private final DocumentSummaryRepository summaryRepository;
    private final SummaryOptionBuilder summaryOptionBuilder;

    @Transactional
    public void handleSummaryResult(AiSummaryResultRequest request) {

        DocumentSummary summary =
                summaryRepository
//                        .findByFileIdAndSessionIdAndRoundNoAndVersionNo(
                        .findByFileFileIdAndSessionSessionIdAndVersionNo(
                                request.getFileId(),
                                request.getSessionId(),
//                                request.getRoundNo(),
                                request.getVersionNo()
                        )


                        .orElseThrow(() ->
                                new IllegalArgumentException("요약 대상 없음")
                        );

        String summaryOption =
                summaryOptionBuilder.build(request.getSummaryText());

        summary.complete(
                request.getSummaryText(),
                request.getModelVersion(),
                summaryOption
        );
        summaryRepository.save(summary);
    }

    @Transactional
    public void handleSummaryFail(AiSummaryFailRequest request) {

        DocumentSummary summary =
                summaryRepository
//                        .findByFileIdAndSessionIdAndRoundNoAndVersionNo(
                        .findByFileFileIdAndSessionSessionIdAndVersionNo(
                                request.getFileId(),
                                request.getSessionId(),
//                                request.getRoundNo(),
                                request.getVersionNo()
                        )
                        .orElseThrow();

        summary.fail(request.getReason());
    }
}
