package com.flocut.demo.domain.file.service;

import com.flocut.demo.global.utils.EncodingUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.*;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile file, String key) {
        try {

            byte[] originalBytes = file.getBytes();

            String contentType = file.getContentType();

            // ✅ text 파일만 인코딩 감지
            if (contentType != null && contentType.startsWith("text")) {

                Charset detected = EncodingUtil.detectCharset(originalBytes);

                // 🔁 UTF-8로 통일
                String text = new String(originalBytes, detected);
                byte[] utf8Bytes = text.getBytes(StandardCharsets.UTF_8);

                PutObjectRequest request = PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType("text/plain; charset=UTF-8")
                        .build();

                s3Client.putObject(
                        request,
                        RequestBody.fromBytes(utf8Bytes)
                );

            } else {
                // text가 아니면 그대로 업로드
                PutObjectRequest request = PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(contentType)
                        .build();

                s3Client.putObject(
                        request,
                        RequestBody.fromBytes(originalBytes)
                );
            }

            return key;

        } catch (Exception e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }

    public String generatePresignedUrl(String key, String mimeType) {

        String responseType = mimeType;

        // 🔥 text 계열이면 무조건 UTF-8로 덮어쓰기
        if (mimeType != null && mimeType.startsWith("text")) {
            responseType = mimeType + "; charset=UTF-8";
        }

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .responseContentType(responseType) // ✅ 여기 핵심
                .build();

        GetObjectPresignRequest presignRequest =
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(10))
                        .getObjectRequest(getObjectRequest)
                        .build();

        return s3Presigner
                .presignGetObject(presignRequest)
                .url()
                .toString();
    }
}
