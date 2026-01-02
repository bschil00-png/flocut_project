package com.flocut.demo.domain.document.service;

//import com.flocut.demo.domain.ai.requester.AiSummaryRequester;
import com.flocut.demo.domain.ai.service.AiFileRelayService;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DocumentSummaryService {

    private final DocumentSummaryWriteService writeService;
    private final AiFileRelayService aiFileRelayService;

    public Long requestSummary(
            Long fileId,
            Long sessionId,
            int roundNo,
            int versionNo
    ) {
        // ✅ 1️⃣ DB row 생성 + COMMIT 완료
        DocumentSummary summary =
                writeService.createSummary(
                        fileId,
                        sessionId,
                        roundNo,
                        versionNo
                );

        // ✅ 2️⃣ 외부(Node / n8n) 호출 → 이제 안전
        aiFileRelayService.requestSummary(
                summary.getFile().getFileId(),
                summary.getFile().getS3Key(),
                summary.getFile().getFileName(),
                summary.getFile().getFileType(),
                sessionId,
                roundNo,
                versionNo
        );

        return summary.getSummaryId();
    }
}



