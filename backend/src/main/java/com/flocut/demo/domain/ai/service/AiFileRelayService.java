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

    //  운영 Node AI Relay (nginx + HTTPS)
    private static final String NODE_AI_BASE_URL =
            "https://node.imchobo.com";

    private static final String DOCUMENT_SUMMARY_URL =
            NODE_AI_BASE_URL + "/api/ai/document-summary";

    private static final String AUDIO_SUMMARY_URL =
            NODE_AI_BASE_URL + "/api/ai/audio-summary";

    private final RestTemplate restTemplate = new RestTemplate();

//   문서요약
    public void requestSummary(
            Long fileId,
            String s3Key,
            String filename,
            String contentType,
            Long sessionId,
            int versionNo
    ) {
        Map<String, Object> body = Map.of(
                "fileId", fileId,
                "s3Key", s3Key,
                "filename", filename,
                "contentType", contentType,
                "sessionId", sessionId,
                "versionNo", versionNo
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
                DOCUMENT_SUMMARY_URL,
                request,
                Void.class
        );
    }

//  음성 요약
    public void requestAudioSummary(
            MultipartFile audioFile,
            Long sessionId
    ) {
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource audioResource = new ByteArrayResource(audioFile.getBytes()) {
                @Override
                public String getFilename() {
                    return audioFile.getOriginalFilename();
                }
            };

            body.add("audio", audioResource);
            body.add("sessionId", sessionId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(body, headers);

            restTemplate.postForEntity(
                    AUDIO_SUMMARY_URL,
                    request,
                    Void.class
            );

        } catch (IOException e) {
            throw new RuntimeException("음성 요약 요청 실패", e);
        }
    }
}
