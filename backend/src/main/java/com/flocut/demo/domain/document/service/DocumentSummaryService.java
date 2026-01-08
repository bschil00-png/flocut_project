package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.ai.service.AiFileRelayService;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DocumentSummaryService {

    private final DocumentSummaryWriteService writeService;
    private final AiFileRelayService aiFileRelayService;

    public Long requestSummary(
            Long fileId,
            Long sessionId
//            int roundNo

    ) {
        // ✅ 1️⃣ DB row 생성 + COMMIT 완료
        DocumentSummary summary =
                writeService.createSummary(
                        fileId,
                        sessionId
//                        roundNo

                );

        // ✅ 2️⃣ 외부(Node / n8n) 호출 → 이제 안전
        aiFileRelayService.requestSummary(
                summary.getFile().getFileId(),
                summary.getFile().getS3Key(),
                summary.getFile().getFileName(),
                summary.getFile().getFileType(),
                sessionId,
//                roundNo,
                summary.getVersionNo()
        );

        return summary.getSummaryId();
    }
}



