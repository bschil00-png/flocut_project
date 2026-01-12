package com.flocut.demo.domain.record.controller;

import com.flocut.demo.domain.record.dto.request.RecordBulkDeleteRequest;
import com.flocut.demo.domain.record.dto.request.RecordCreateRequest;
import com.flocut.demo.domain.record.dto.request.RecordUpdateRequest;
import com.flocut.demo.domain.record.dto.response.DeleteResultResponse;
import com.flocut.demo.domain.record.dto.response.TranscribeResponse;
import com.flocut.demo.domain.record.service.RecordService;
import com.flocut.demo.domain.record.service.WhisperService;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/records")
@Log4j2
public class RecordController {

    private final RecordService recordService;
    private final WhisperService whisperService;

    // 생성
    @PostMapping
    public ResponseEntity<Long> save(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody RecordCreateRequest request
    ) {
        // user.getMember()를 통해 이미 로드된 Member 엔티티를 그대로 넘김
        return ResponseEntity.ok(
                recordService.save(user.getMember(), request)
        );
    }


    @PostMapping("/transcribe")
    public ResponseEntity<TranscribeResponse> transcribe(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam("audio") MultipartFile audio,
            @RequestParam Long sessionId,
            @RequestParam(required = false) Long noteId,
            @RequestParam(defaultValue = "ko") String language
    ) {
        log.info("음성 업로드 시작 - 세션: {}, 노트: {}, 언어: {}", sessionId, noteId, language);

        // 1. Whisper STT 호출
        String transcript = whisperService.transcribe(audio, language);

        // 2. Record 저장
        RecordCreateRequest request = RecordCreateRequest.builder()
                .sessionId(sessionId)
                .noteId(noteId)
                .content(transcript)
                .build();

        Long recordId = recordService.save(user.getMember(), request);

        log.info("Record 저장 완료 - ID: {}", recordId);

        return ResponseEntity.ok(
                TranscribeResponse.builder()
                        .recordId(recordId)
                        .transcript(transcript)
                        .build()
        );
    }

    // update

    @PutMapping("/{recordId}")
    public ResponseEntity<Void> update(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long recordId,
            @RequestBody RecordUpdateRequest request
    ) {
        recordService.update(
                recordId,
                user.getMember().getMemberId(),
                request.getContent()
        );
        return ResponseEntity.noContent().build();
    }

    //  hard delet

    @DeleteMapping
    public ResponseEntity<DeleteResultResponse> bulkDelete(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody RecordBulkDeleteRequest request
    ) {
        int deletedCount =
                recordService.bulkDelete(
                        user.getMember().getMemberId(),
                        request.getRecordId()
                );

        return ResponseEntity.ok(
                new DeleteResultResponse(deletedCount)
        );
    }

//    @DeleteMapping("/{recordId}")
//    public ResponseEntity<Void> delete(
//            @AuthenticationPrincipal CustomUserDetails user,
//            @PathVariable Long recordId
//    ) {
//        recordService.delete(
//                recordId,
//                user.getMember().getMemberId()
//        );
//        return ResponseEntity.noContent().build();
//    }


}
