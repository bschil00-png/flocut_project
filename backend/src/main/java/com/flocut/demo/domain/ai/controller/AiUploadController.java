package com.flocut.demo.domain.ai.controller;

import com.flocut.demo.domain.ai.service.AiFileRelayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiUploadController {

    private final AiFileRelayService aiFileRelayService;

    /**
     * 🔥 Spring → Node AI 파일 전달 테스트
     */
    @PostMapping("/upload-test")
    public ResponseEntity<Map<String, Object>> uploadTest(
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        Map<String, Object> aiResult =
                aiFileRelayService.sendFileToAi(file);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "aiResult", aiResult
        ));
    }
}
