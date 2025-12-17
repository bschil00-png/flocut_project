package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.LoginRequest;
import com.flocut.demo.domain.member.dto.LoginResponse;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;

    // =========================
    // 로그인
    // =========================
    @PostMapping("/login")

    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            Member member = memberService.login(request.getEmail(), request.getPassword());

            String token = jwtUtil.generateToken(member.getEmail());

            ResponseCookie cookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponse(memberMapper.toDto(member), token));

        } catch (Exception e) {
            e.printStackTrace(); //  실제 오류 출력
            return ResponseEntity.status(400).body(null);
        }
    }


    // =========================
    // 로그인 유지 확인
    // =========================
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("로그인이 필요합니다.");
        }

        String email = authentication.getName();
        Member member = memberService.findByEmail(email);

        return ResponseEntity.ok(memberMapper.toDto(member));

    }
}
