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
@Transactional
public class DocumentSummaryService {

    private final DocumentSummaryRepository summaryRepository;
    private final FileRepository fileRepository;
    private final SessionRepository sessionRepository;
    private final AiFileRelayService aiFileRelayService;

    public Long requestSummary(
            Long fileId,
            Long sessionId,
            int roundNo,
            int versionNo
    ) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        // 1️⃣ 요약 row 생성
        DocumentSummary summary = summaryRepository.save(
                DocumentSummary.create(
                        file,
                        session,
                        roundNo,
                        versionNo
                )
        );

        // 2️⃣ S3 정보만 전달
        aiFileRelayService.requestSummary(
                file.getS3Key(),
                file.getFileName(),
                file.getFileType(),
                sessionId,
                roundNo,
                versionNo
        );

        return summary.getSummaryId();
    }
}


