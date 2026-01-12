package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.ai.service.AiFileRelayService;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.entity.SummaryStatus;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class DocumentSummaryService {

    private final DocumentSummaryWriteService writeService;
    private final AiFileRelayService aiFileRelayService;
    private final DocumentSummaryRepository summaryRepository;

    public Long requestSummary(
            Long fileId,
            Long sessionId
    ) {
        // ✅ 1️⃣ DB row 생성 + COMMIT 완료
        DocumentSummary summary =
                writeService.createSummary(
                        fileId,
                        sessionId
                );

        // ✅ 2️⃣ 외부(Node / n8n) 호출 → 이제 안전
        aiFileRelayService.requestSummary(
                summary.getFile().getFileId(),
                summary.getFile().getS3Key(),
                summary.getFile().getFileName(),
                summary.getFile().getFileType(),
                sessionId,
                summary.getVersionNo()
        );

        return summary.getSummaryId();
    }
    @Transactional
    public void deleteSummary(Long summaryId) {

        DocumentSummary summary =
                summaryRepository.findById(summaryId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("요약 없음")
                        );

        // 이미 삭제된 경우
        if (summary.getStatus() == SummaryStatus.DELETED) {
            return;
        }

        summary.changeStatus(SummaryStatus.DELETED);
    }


}



