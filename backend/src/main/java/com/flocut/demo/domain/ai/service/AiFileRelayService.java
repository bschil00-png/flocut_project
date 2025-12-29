package com.flocut.demo.domain.ai.service;

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
public class AiFileRelayService {

    private final RestTemplate restTemplate = new RestTemplate();

    // 🔥 Node AI Relay 서버
    private static final String NODE_AI_URL =
            "http://localhost:8081/api/ai-file";

    public Map<String, Object> sendFileToAi(MultipartFile file) throws IOException {

        // 1️⃣ multipart body 생성
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        body.add("data", fileResource);

        // 2️⃣ Header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        // 3️⃣ Node 서버 호출
        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        NODE_AI_URL,
                        requestEntity,
                        Map.class
                );

        return response.getBody();
    }
}
