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

//@Service
//@RequiredArgsConstructor
//public class NoteSummaryService {
//
//  private final FileRepository fileRepository;
//  private final S3UploadService s3UploadService;
//  private final DocumentSummaryWriteService documentSummaryWriteService;
//  private final AiFileRelayService aiFileRelayService;
//
//  @Transactional
//  public Long requestSummary(Note note) {
//
//    // S3 key 생성
//    String s3Key =
//            "note/summary/"
//                    + note.getNoteId()
//                    + "_"
//                    + System.currentTimeMillis()
//                    + ".txt";
//
//    // Note content → MultipartFile
//    MultipartFile noteFile = new MockMultipartFile(
//            "file",
//            "note_summary_" + note.getNoteId() + ".txt",
//            "text/plain",
//            note.getContent().getBytes(StandardCharsets.UTF_8)
//    );
//
//    //  기존 S3UploadService 그대로 사용
//    s3UploadService.upload(noteFile, s3Key);
//
//    //  NOTE_TEMP File 생성
//    File tempFile = File.create(
//            note.getMember(),
//            note.getSession(),
//            "note_summary_" + note.getNoteId() + ".txt",
//            s3Key,
//            "txt",
//            "text/plain",
//            (long) note.getContent().length()
//    );
//    tempFile.setStatus(FileStatus.NOTE_TEMP);
//    fileRepository.save(tempFile);
//
//    // DocumentSummary 생성
//    DocumentSummary summary =
//            documentSummaryWriteService.createSummary(
//                    tempFile.getFileId(),
//                    note.getSession().getSessionId()
//            );
//
//    // AI 요청
//    aiFileRelayService.requestSummary(
//            tempFile.getFileId(),
//            tempFile.getS3Key(),
//            tempFile.getFileName(),
//            tempFile.getMimeType(),
//            note.getSession().getSessionId(),
//            summary.getVersionNo()
//    );
//
//    return summary.getSummaryId();
//  }
//}


@Service
@RequiredArgsConstructor
public class NoteSummaryService {

    private final S3UploadService s3UploadService;
    private final NoteSummaryWriteService tempFileWriteService;
    private final DocumentSummaryWriteService documentSummaryWriteService;
    private final AiFileRelayService aiFileRelayService;

    public Long requestSummary(Note note) {

        // 1️⃣ S3 업로드
        String s3Key = "note/summary/" + note.getNoteId() + "_" + System.currentTimeMillis() + ".txt";

        MultipartFile noteFile = new MockMultipartFile(
                "file",
                "note_summary_" + note.getNoteId() + ".txt",
                "text/plain",
                note.getContent().getBytes(StandardCharsets.UTF_8)
        );
        s3UploadService.upload(noteFile, s3Key);

        // 2️⃣ File 생성 (COMMIT 보장)
        File tempFile = tempFileWriteService.createTempFile(note.getNoteId(), s3Key);

        // 3️⃣ DocumentSummary 생성 (COMMIT 보장)
        DocumentSummary summary =
                documentSummaryWriteService.createSummary(
                        tempFile.getFileId(),
                        note.getSession().getSessionId()
                );

        // 4️⃣ AI 호출
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

