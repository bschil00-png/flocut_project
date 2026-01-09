package com.flocut.demo.domain.document.controller;


import com.flocut.demo.domain.document.dto.request.DocumentSummaryRequest;
import com.flocut.demo.domain.document.service.DocumentSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

