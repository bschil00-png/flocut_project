package com.flocut.demo.domain.ai.service;

import com.flocut.demo.domain.ai.dto.request.AiSummaryFailRequest;
import com.flocut.demo.domain.ai.dto.request.AiSummaryResultRequest;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import com.flocut.demo.domain.document.service.SummaryOptionBuilder;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.file.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Log4j2
public class AiSummaryCallbackService {

  private final DocumentSummaryRepository summaryRepository;
  private final SummaryOptionBuilder summaryOptionBuilder;
  private final S3UploadService s3UploadService;
  private final FileRepository fileRepository;

  @Transactional
  public void handleSummaryResult(AiSummaryResultRequest request) {

    DocumentSummary summary =
            summaryRepository
                    .findByFileFileIdAndSessionSessionIdAndVersionNo(
                            request.getFileId(),
                            request.getSessionId(),
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
    //    노트 파일 삭제
    cleanupTempFileIfNeeded(summary.getFile());
  }

  @Transactional
  public void handleSummaryFail(AiSummaryFailRequest request) {

    DocumentSummary summary =
            summaryRepository
                    .findByFileFileIdAndSessionSessionIdAndVersionNo(
                            request.getFileId(),
                            request.getSessionId(),
                            request.getVersionNo()
                    )
                    .orElseThrow();

    summary.fail(request.getReason());
//    실패 관련 저장 로직 미구현 된 부분 추가
    summaryRepository.save(summary);
//    노트 파일 삭제
    cleanupTempFileIfNeeded(summary.getFile());
  }

  //    노트 요약 요청 파일 삭제
  private void cleanupTempFileIfNeeded(File file) {
//    노트 요약 요청 파일이 아니면 리턴 처리
    if (file.getStatus() != FileStatus.NOTE_TEMP) return;

    //  S3 삭제
    try {
      s3UploadService.delete(file.getS3Key());
    } catch (Exception e) {
      log.warn("NOTE_TEMP S3 삭제 실패: {}", file.getS3Key(), e);
    }
      file.softDelete();
  }
}
