package com.flocut.demo.domain.ai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiFileRelayService {

    private static final String NODE_AI_URL =
            "http://localhost:8081/api/ai/document-summary";

    private final RestTemplate restTemplate = new RestTemplate();

    public void requestSummary(
            Long fileId,
            String s3Key,
            String filename,
            String contentType,
            Long sessionId,
            int roundNo,
            int versionNo
    ) {
        Map<String, Object> body = Map.of(
                "fileId", fileId,
                "s3Key", s3Key,
                "filename", filename,
                "contentType", contentType,
                "sessionId", sessionId,
                "roundNo", roundNo,
                "versionNo", versionNo
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
                NODE_AI_URL,
                request,
                Void.class
        );
    }
}

