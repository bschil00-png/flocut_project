package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.ai.service.AiFileRelayService;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.service.DocumentSummaryWriteService;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.file.service.S3UploadService;
import com.flocut.demo.domain.note.entity.Note;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class NoteSummaryService {

    private final S3UploadService s3UploadService;
    private final NoteSummaryWriteService tempFileWriteService;
    private final DocumentSummaryWriteService documentSummaryWriteService;
    private final AiFileRelayService aiFileRelayService;

    public Long requestSummary(Note note) {

        //  S3 업로드
        String s3Key = "note/summary/" + note.getNoteId() + "_" + System.currentTimeMillis() + ".txt";

        MultipartFile noteFile = new MockMultipartFile(
                "file",
                "note_summary_" + note.getNoteId() + ".txt",
                "text/plain",
                note.getContent().getBytes(StandardCharsets.UTF_8)
        );
        s3UploadService.upload(noteFile, s3Key);

        // File 생성 (COMMIT 보장)
        File tempFile = tempFileWriteService.createTempFile(note.getNoteId(), s3Key);

        // DocumentSummary 생성 (COMMIT 보장)
        DocumentSummary summary =
                documentSummaryWriteService.createSummary(
                        tempFile.getFileId(),
                        note.getSession().getSessionId()
                );

        note.setSummary(summary);


        // AI 호출
        aiFileRelayService.requestSummary(
                tempFile.getFileId(),
                tempFile.getS3Key(),
                tempFile.getFileName(),
                tempFile.getMimeType(),
                note.getSession().getSessionId(),
                summary.getVersionNo()
        );

        return summary.getSummaryId();
    }
}

