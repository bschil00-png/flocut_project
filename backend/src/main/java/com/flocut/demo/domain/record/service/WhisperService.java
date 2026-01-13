package com.flocut.demo.domain.record.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhisperService {

  @Value("${openai.api.key}")
  private String openaiApiKey;

  private static final String WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";
  private final RestTemplate restTemplate = new RestTemplate();


   // 음성 파일을 Whisper API로 전송하여 텍스트로 변환

  public String transcribe(MultipartFile audioFile, String language) {
    try {
      log.info("Whisper STT 시작 - 파일: {}, 언어: {}", audioFile.getOriginalFilename(), language);

      // 1. 임시 파일로 저장 (Whisper API는 File 객체 필요)
      File tempFile = convertMultipartFileToFile(audioFile);

      try {
        // 2. Whisper API 호출
        String transcript = callWhisperApi(tempFile, language);

        log.info("Whisper STT 성공 - 결과 길이: {}", transcript.length());
        return transcript;

      } finally {
        // 3. 임시 파일 삭제
        if (tempFile.exists()) {
          tempFile.delete();
        }
      }

    } catch (Exception e) {
      log.error("Whisper STT 실패", e);
      throw new RuntimeException("음성 인식 실패: " + e.getMessage());
    }
  }


   // OpenAI Whisper API 호출

  private String callWhisperApi(File audioFile, String language) {
    try {
      // HTTP Headers
      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(openaiApiKey);
      headers.setContentType(MediaType.MULTIPART_FORM_DATA);

      // Request Body (MultiValueMap)
      MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
      body.add("file", new org.springframework.core.io.FileSystemResource(audioFile));
      body.add("model", "whisper-1");

      // language가 "auto"가 아닐 경우에만 추가
      if (language != null && !language.equals("auto")) {
        body.add("language", language);
      }

      HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

      // API 호출
      ResponseEntity<Map> response = restTemplate.exchange(
              WHISPER_API_URL,
              HttpMethod.POST,
              requestEntity,
              Map.class
      );

      // 응답 파싱
      if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
        return (String) response.getBody().get("text");
      } else {
        throw new RuntimeException("Whisper API 응답 오류");
      }

    } catch (Exception e) {
      log.error("Whisper API 호출 실패", e);
      throw new RuntimeException("Whisper API 호출 실패: " + e.getMessage());
    }
  }


   // MultipartFile을 임시 File로 변환

  private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
    String originalFilename = multipartFile.getOriginalFilename();
    String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".tmp";

    // 임시 파일 생성
    Path tempPath = Files.createTempFile("whisper_", extension);
    Files.copy(multipartFile.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);

    return tempPath.toFile();
  }
}