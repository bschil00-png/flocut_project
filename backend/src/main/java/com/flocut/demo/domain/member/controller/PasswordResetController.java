package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.RequestDTO.PasswordUpdateRequestDTO;
import com.flocut.demo.domain.member.dto.RequestDTO.PasswordChangeRequestDTO;
import com.flocut.demo.domain.member.dto.RequestDTO.PasswordResetRequestDTO;
import com.flocut.demo.domain.member.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    //  이메일 입력
    @PostMapping("/reset-request")
    public ResponseEntity<?> requestReset(
            @RequestBody PasswordResetRequestDTO dto
    ) {
        passwordResetService.requestReset(dto.getEmail());
        return ResponseEntity.ok("이메일 전송 완료");
    }

    //  새 비밀번호 설정
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody PasswordChangeRequestDTO dto
    ) {
        passwordResetService.resetPassword(
                dto.getToken(),
                dto.getNewPassword()
        );
        return ResponseEntity.ok("비밀번호 변경 완료");
    }

    @PostMapping("/change")
    public ResponseEntity<?> changePassword(
            @RequestBody PasswordUpdateRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        passwordResetService.changePassword(
                userDetails.getUsername(), // 현재 로그인한 사용자의 이메일
                dto.getCurrentPassword(),
                dto.getNewPassword()
        );
        return ResponseEntity.ok("비밀번호 변경 완료");
    }
}
