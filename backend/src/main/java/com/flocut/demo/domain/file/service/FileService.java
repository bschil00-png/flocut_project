package com.flocut.demo.domain.file.service;

import com.flocut.demo.domain.document.service.DocumentTextService;
import com.flocut.demo.domain.file.dto.response.FileItemResponse;
import com.flocut.demo.domain.file.dto.response.FileUploadResponse;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FileService {

    private final FileRepository fileRepository;
    private final MemberRepository memberRepository;
    private final DocumentTextService documentTextService;
    private final S3UploadService s3UploadService;
    public FileUploadResponse upload(MultipartFile file, Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일");
        }

        // ✅ S3 key 생성 (지금 구조에 딱 맞음)
        String s3Key = "member/%d/document/%s"
                .formatted(memberId, file.getOriginalFilename());

        // ✅ 실제 S3 업로드
        s3UploadService.upload(file, s3Key);

        File saved = File.create(
                member,
                file.getOriginalFilename(),
                s3Key,
                extractFileType(file),
                file.getContentType(),
                file.getSize()
        );

        fileRepository.save(saved);
        documentTextService.createEmptyText(saved);

        return new FileUploadResponse(
                saved.getFileId(),
                saved.getStatus()
        );
    }

    public List<FileItemResponse> getMyFiles(Long memberId) {
        return fileRepository
                .findByMemberMemberIdAndStatusOrderByRegdateDesc(
                        memberId,
                        FileStatus.UPLOADED
                )
                .stream()
                .map(FileItemResponse::from)
                .toList();
    }

    private String extractFileType(MultipartFile file) {
        String name = file.getOriginalFilename();
        return name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    }
}
