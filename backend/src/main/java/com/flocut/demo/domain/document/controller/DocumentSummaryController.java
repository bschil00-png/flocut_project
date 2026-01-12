package com.flocut.demo.domain.document.controller;


import com.flocut.demo.domain.document.dto.request.DocumentSummaryRequest;
import com.flocut.demo.domain.document.service.DocumentSummaryService;
import com.flocut.demo.domain.document.service.DocumentSummaryWriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents/summaries")
public class DocumentSummaryController {

    private final DocumentSummaryService summaryService;


//    노트랑 문서
    @PostMapping("/request")
    public ResponseEntity<Long> requestSummary(
            @RequestBody DocumentSummaryRequest request
    ) {
        Long summaryId =
                summaryService.requestSummary(
                        request.getFileId(),
                        request.getSessionId()
//                        request.getRoundNo()

                );

        return ResponseEntity.ok(summaryId);
    }

    @DeleteMapping("/{summaryId}")
    public ResponseEntity<Void> deleteSummary(
            @PathVariable Long summaryId
    ) {
        summaryService.deleteSummary(summaryId);
        return ResponseEntity.noContent().build(); // 204
    }
}

