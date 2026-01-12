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
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


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

    public PageResponseDTO<FileItemResponse> getMyFiles(
            Long sessionId,
            Long memberId,
            PageRequestDTO pageRequest
    ) {
        Page<File> page =
                fileRepository
                        .findBySessionSessionIdAndMemberMemberIdAndStatusOrderByRegdateDesc(
                                sessionId,
                                memberId,
                                FileStatus.UPLOADED,
                                PageRequest.of(
                                        pageRequest.getPage(),
                                        pageRequest.getSize(),
                                        Sort.by(Sort.Direction.DESC, "regdate")
                                )
                        );

        return new PageResponseDTO<>(
                page.getContent()
                        .stream()
                        .map(FileItemResponse::from)
                        .toList(),

                page.getTotalElements(),
                page.getTotalPages(),

                page.getNumber(),
                page.getSize(),

                page.hasNext(),
                page.hasPrevious(),

                page.isFirst(),
                page.isLast()
        );
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
//        노트 요약요청시 파일은 요약 콜백 쪽에서 요약 완료 시에 삭제 가능하게 추가했습니다.
        if (file.getStatus() == FileStatus.NOTE_TEMP) {
            throw new IllegalStateException("임시 요약 파일은 직접 삭제할 수 없습니다.");
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
