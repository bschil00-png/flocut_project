package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.document.entity.DocumentText;
import com.flocut.demo.domain.document.repository.DocumentTextRepository;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.global.utils.DocxTextExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentTextService {

    private final DocumentTextRepository documentTextRepository;
    private final FileRepository fileRepository;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    /**
     * 파일 업로드 직후 호출 (기존 유지)
     */
    public DocumentText createEmptyText(File file) {

        if (documentTextRepository.existsByFile_FileId(file.getFileId())) {
            throw new IllegalStateException("이미 DocumentText가 존재합니다");
        }

        DocumentText text = DocumentText.create(
                file,
                null,
                "",
                false
        );

        return documentTextRepository.save(text);
    }


    @Transactional(readOnly = true)
    public String extractText(Long fileId) {

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        String type = file.getFileType();

        // 🔐 TXT
        if ("txt".equals(type)) {
            try (InputStream s3Stream = s3Client.getObject(
                    GetObjectRequest.builder()
                            .bucket(bucket)
                            .key(file.getS3Key())
                            .build()
            )) {
                // 이미 업로드 시 UTF-8로 통일됨
                return new String(s3Stream.readAllBytes(), StandardCharsets.UTF_8);
            } catch (Exception e) {
                throw new RuntimeException("TXT 텍스트 추출 실패", e);
            }
        }

        // 🔐 DOCX
        if ("docx".equals(type)) {
            try (InputStream s3Stream = s3Client.getObject(
                    GetObjectRequest.builder()
                            .bucket(bucket)
                            .key(file.getS3Key())
                            .build()
            )) {
                return DocxTextExtractor.extract(s3Stream);
            } catch (Exception e) {
                throw new RuntimeException("DOCX 텍스트 추출 실패", e);
            }
        }

        throw new IllegalArgumentException("텍스트 미리보기를 지원하지 않는 파일 타입");
    }
}
