package com.flocut.demo.domain.file.controller;

import com.flocut.demo.domain.document.service.DocumentTextService;
import com.flocut.demo.domain.file.dto.response.FileUploadResponse;
import com.flocut.demo.domain.file.service.FileService;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final MemberService memberService;
    private final DocumentTextService documentTextService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<FileUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sessionId") Long sessionId,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return ResponseEntity.ok(
                fileService.upload(file, member.getMemberId(), sessionId)
        );
    }
    //이미지,pdf 등
    @GetMapping("/{fileId}/preview")
    public ResponseEntity<String> previewFile(
            @PathVariable Long fileId,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());
        String url = fileService.generatePreviewUrl(fileId, member.getMemberId());
        return ResponseEntity.ok(url);
    }
    //text,docx 파일
    @GetMapping("/{fileId}/preview/text")
    public ResponseEntity<String> previewText(
            @PathVariable Long fileId,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        fileService.validateFileOwner(fileId, member.getMemberId());

        String text = documentTextService.extractText(fileId);

        return ResponseEntity.ok(text);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        fileService.deleteFile(fileId, member.getMemberId());

        return ResponseEntity.noContent().build();
    }
}
