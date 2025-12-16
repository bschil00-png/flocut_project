package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.LoginRequest;
import com.flocut.demo.domain.member.dto.LoginResponse;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.global.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        // 1) 이메일/비밀번호로 로그인
        Member member = memberService.login(request.getEmail(), request.getPassword());

        // 2) JWT 생성
        String token = jwtUtil.generateToken(member.getEmail());

        // 3) HttpOnly 쿠키 생성
        ResponseCookie cookie = ResponseCookie.from("token", token)
                //        httpOnly(true)	JS 접근 차단 (XSS 방어)
//        secure(false)	HTTPS일 때만 전송 (로컬이라 false)
//        sameSite("None")	Next.js ↔ Spring cross-site 허용
//        path("/")	모든 요청에 쿠키 포함
//        maxAge(1일)	로그인 유지 시간
                .httpOnly(true)
                .secure(false)   // 로컬 개발 환경
                .sameSite("None") // ⭐⭐ cross-site 쿠키 필수
                .path("/")
                .maxAge(Duration.ofDays(1))   // 1일
                .build();

        // 4) 응답에 Set-Cookie 헤더 추가
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 5) (선택) body로도 LoginResponse 내려줌
        LoginResponse body = new LoginResponse(
                memberMapper.toDto(member),
                token
        );

        return ResponseEntity.ok(body);
    }
}
