package com.flocut.demo.domain.member.resolver;

import com.flocut.demo.domain.member.dto.LoginResponse;
import com.flocut.demo.domain.member.dto.MemberDto;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.global.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

@Controller
@RequiredArgsConstructor
public class MemberResolver {

    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;
    private final HttpServletResponse response;   // ⭐ 핵심 추가

    @MutationMapping
    public MemberDto register(@Argument("input") @Valid RegisterInput input) {

        Member member = Member.builder()
                .email(input.getEmail())
                .password(input.getPassword())
                .name(input.getName())
                .build();

        Member saved = memberService.register(member);
        return memberMapper.toDto(saved);
    }

    @MutationMapping
    public LoginResponse login(
            @Argument String email,
            @Argument String password
    ) {
        // 1️⃣ 로그인 검증
        Member member = memberService.login(email, password);

        // 2️⃣ JWT 생성
        String token = jwtUtil.generateToken(email);

        // 3️⃣ 쿠키 생성 (GraphQL 로그인에서도!)
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)      // 로컬 개발 환경
                .sameSite("None")   // ⭐ cross-site 필수
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        // 4️⃣ Set-Cookie 헤더 추가
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // 5️⃣ 응답 반환
        return new LoginResponse(memberMapper.toDto(member), token);
    }

    @QueryMapping
    public MemberDto member(@Argument Long id) {
        Member member = memberService.getMember(id);
        return memberMapper.toDto(member);
    }

    @QueryMapping
    public MemberDto me(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        String email = authentication.getName();
        Member member = memberService.findByEmail(email);

        return memberMapper.toDto(member);
    }
}
