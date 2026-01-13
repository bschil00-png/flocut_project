package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DocumentSummaryWriteService {

    private final DocumentSummaryRepository summaryRepository;
    private final FileRepository fileRepository;
    private final SessionRepository sessionRepository;


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public DocumentSummary createSummary(
            Long fileId,
            Long sessionId
    ) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        Integer maxVersion =
                summaryRepository.findMaxVersionNo(fileId, sessionId);

        int nextVersionNo = (maxVersion == null) ? 1 : maxVersion + 1;

        return summaryRepository.save(
                DocumentSummary.create(
                        file,
                        session,
                        nextVersionNo
                )
        );
    }
}
