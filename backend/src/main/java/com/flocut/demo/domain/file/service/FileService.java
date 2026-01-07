package com.flocut.demo.domain.file.service;

import com.flocut.demo.domain.document.service.DocumentTextService;
import com.flocut.demo.domain.file.dto.response.FileItemResponse;
import com.flocut.demo.domain.file.dto.response.FileUploadResponse;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
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
    private final SessionRepository sessionRepository;

    public FileUploadResponse upload(
            MultipartFile file,
            Long memberId,
            Long sessionId
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        // 🔐 세션 소유자 검증
        if (!session.getMember().getMemberId().equals(memberId)) {
            throw new SecurityException("세션 접근 권한 없음");
        }

        // ✅ S3 key 생성 (지금 구조에 딱 맞음)
        String s3Key = "member/%d/document/%s"
                .formatted(memberId, file.getOriginalFilename());

        // ✅ 실제 S3 업로드
        s3UploadService.upload(file, s3Key);

        File saved = File.create(
                member,
                session,
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
                saved.getSession().getSessionId(),
                saved.getStatus()
        );
    }

    public List<FileItemResponse> getMyFiles(
            Long sessionId,
            Long memberId
    ) {
        return fileRepository
                .findBySessionSessionIdAndMemberMemberIdAndStatusOrderByRegdateDesc(
                        sessionId,
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

    @Transactional(readOnly = true)
    public String generatePreviewUrl(Long fileId, Long memberId) {

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        // 🔐 본인 파일 체크
        if (!file.getMember().getMemberId().equals(memberId)) {
            throw new SecurityException("접근 권한 없음");
        }

        return s3UploadService.generatePresignedUrl(
                file.getS3Key(),
                file.getMimeType()
        );
    }

    @Transactional(readOnly = true)
    public void validateFileOwner(Long fileId, Long memberId) {

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        if (!file.getMember().getMemberId().equals(memberId)) {
            throw new SecurityException("접근 권한 없음");
        }
    }

    public void deleteFile(Long fileId, Long memberId) {

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        // 🔐 소유자 검증
        if (!file.getMember().getMemberId().equals(memberId)) {
            throw new SecurityException("삭제 권한 없음");
        }

        // ❌ 이미 삭제된 파일
        if (file.getStatus() == FileStatus.DELETED) {
            throw new IllegalStateException("이미 삭제된 파일");
        }

        // 1️⃣ S3 실제 파일 삭제
        s3UploadService.delete(file.getS3Key());

        // 2️⃣ DB 소프트 삭제
        file.softDelete();
    }





}
