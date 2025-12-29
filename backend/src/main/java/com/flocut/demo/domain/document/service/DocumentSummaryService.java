package com.flocut.demo.domain.document.service;

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

    /**
     * 🔹 AI 없는 mock 요약 저장
     */
    public DocumentSummary createMockSummary(
            Long fileId,
            Long sessionId,
            int roundNo,
            int versionNo
    ) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        DocumentSummary summary = DocumentSummary.create(
                file,
                session,
                roundNo,
                versionNo,
                "이것은 AI 없이 생성된 mock 요약입니다.",
                "mock-model-v1"
        );

        return summaryRepository.save(summary);
    }
}
