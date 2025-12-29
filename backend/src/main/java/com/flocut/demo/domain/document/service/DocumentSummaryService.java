package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.ai.requester.AiSummaryRequester;
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
    private final AiSummaryRequester aiSummaryRequester;

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

        // 1️⃣ DB에 먼저 저장
        DocumentSummary summary =
                summaryRepository.save(
                        DocumentSummary.create(
                                file,
                                session,
                                roundNo,
                                versionNo
                        )
                );

        // 2️⃣ AI 요청 (비동기, 결과 안 기다림)
        aiSummaryRequester.requestSummary(
                file.getFileId(),
                session.getSessionId(),
                roundNo,
                versionNo
        );

        // 3️⃣ summaryId만 반환
        return summary.getSummaryId();
    }
}

