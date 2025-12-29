package com.flocut.demo.domain.document.controller;

import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.service.DocumentSummaryService;
import com.flocut.demo.domain.document.dto.request.DocumentSummaryMockRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents/summaries")
@RequiredArgsConstructor
public class DocumentSummaryController {

    private final DocumentSummaryService summaryService;

    @PostMapping("/mock")
    public ResponseEntity<Long> createMockSummary(
            @RequestBody DocumentSummaryMockRequest request
    ) {
        DocumentSummary summary = summaryService.createMockSummary(
                request.getFileId(),
                request.getSessionId(),
                request.getRoundNo(),
                request.getVersionNo()
        );

        return ResponseEntity.ok(summary.getSummaryId());
    }
}
