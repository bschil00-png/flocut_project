package com.flocut.demo.domain.file.controller;

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

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<FileUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return ResponseEntity.ok(
                fileService.upload(file, member.getMemberId())
        );
    }
}
