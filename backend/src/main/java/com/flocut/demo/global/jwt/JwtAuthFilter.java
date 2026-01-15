package com.flocut.demo.global.jwt;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.global.utils.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
//
//        //  모든 요청 경로 로그
//        log.info( JwtAuthFilter 진입 - method={}, path={}", method, path);

        //  AI 콜백은 JWT 필터 자체를 완전히 스킵
        if (
                path.contains("/ai/summary/callback") ||
                        path.contains("/ai/summary/fail")
        ) {
            log.info(" AI CALLBACK 요청 → JWT 필터 스킵 (path={})", path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;

        //  Authorization 헤더
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
//            log.info("JWT 발견 (Authorization Header)");
        }

        // Cookie (accessToken)
        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
//                    log.info(" JWT 발견 (Cookie)");
                    break;
                }
            }
        }

        //  토큰이 없는 경우
        if (token == null) {
//            log.info(" JWT 없음 → 인증 없이 진행 (path={})", path);
            filterChain.doFilter(request, response);
            return;
        }

        //  토큰 검증
        if (!jwtUtil.validateToken(token)) {
//            log.warn(" JWT 검증 실패 → 인증 세팅 안 함");
            filterChain.doFilter(request, response);
            return;
        }

        // 이미 인증된 경우 스킵
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
//            log.info(" 이미 인증된 요청 → 스킵");
            filterChain.doFilter(request, response);
            return;
        }

        //  사용자 조회
        String email = jwtUtil.getEmailFromToken(token);
        Member member = memberRepository.findByEmail(email).orElse(null);

        if (member == null) {
            log.warn(" JWT는 유효하지만 사용자 없음 (email={})", email);
            filterChain.doFilter(request, response);
            return;
        }

        if (member.getStatus() != MemberStatus.ACTIVE) {
            log.warn(" 비활성 사용자 차단 (email={}, status={})",
                    email, member.getStatus());
            filterChain.doFilter(request, response);
            return;
        }

        //  인증 객체 생성
        CustomUserDetails userDetails = new CustomUserDetails(member);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        log.info(" JWT 인증 완료 (email={}, role={})",
                member.getEmail(), member.getRole());

        filterChain.doFilter(request, response);
    }
}
