package com.flocut.demo.domain.ai.controller;

import com.flocut.demo.domain.ai.dto.request.AiSummaryFailRequest;
import com.flocut.demo.domain.ai.dto.request.AiSummaryResultRequest;
import com.flocut.demo.domain.ai.service.AiSummaryCallbackService;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiCallbackController {

//     프론트는 호출하면 안 됨.....
//     AI <-> 백엔드  전용
    private final AiSummaryCallbackService callbackService;

    @PostMapping("/summary/callback")
    public void receiveSummaryResult(
            @RequestBody AiSummaryResultRequest request
    ) {
        callbackService.handleSummaryResult(request);
        System.out.println("🔥 CALLBACK RECEIVED");
    }

    @PostMapping("/summary/fail")
    public void receiveSummaryFail(
            @RequestBody AiSummaryFailRequest request
    ) {
        callbackService.handleSummaryFail(request);
    }
}
