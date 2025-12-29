package com.flocut.demo.domain.document.controller;


import com.flocut.demo.domain.document.service.DocumentSummaryService;
import com.flocut.demo.domain.document.dto.request.DocumentSummaryMockRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents/summaries")
public class DocumentSummaryController {

    private final DocumentSummaryService summaryService;

    @PostMapping("/request")
    public ResponseEntity<Long> requestSummary(
            @RequestBody DocumentSummaryMockRequest request
    ) {
        Long summaryId =
                summaryService.requestSummary(
                        request.getFileId(),
                        request.getSessionId(),
                        request.getRoundNo(),
                        request.getVersionNo()
                );

        return ResponseEntity.ok(summaryId);
    }
}

