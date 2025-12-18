package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.RequestDTO.MemberRegisterRequestDTO;
import com.flocut.demo.domain.member.dto.RequestDTO.LoginRequestDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.LoginResponseDTO;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.global.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
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
    // 회원가입
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid MemberRegisterRequestDTO request) {

        Member member = Member.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .build();

        Member saved = memberService.register(member);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(memberMapper.toDto(saved));
    }



    // =========================
    // 로그인
    // =========================
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        try {

            Member member = memberService.login(request.getEmail(), request.getPassword());

            String token = jwtUtil.generateToken(member.getEmail());

            ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                    .httpOnly(true)
                    .secure(false)        // 로컬 환경
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponseDTO(member.getMemberId(), token));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); //  # 400=HttpStatus.BAD_REQUEST
        }
    }

    // =========================
    // 로그아웃
    // =========================
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        // ⭐ 기존 token 쿠키를 즉시 만료
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)        // 로그인 때와 동일해야 함
                .sameSite("Lax")
                .path("/")
                .maxAge(0)            // ⭐ 즉시 삭제
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok().build();
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
