package com.flocut.demo.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("=== JWT FILTER ENTER ===");
        System.out.println("URI = " + request.getRequestURI());

        String token = null;

        // Authorization 헤더가 있어도, 없다고 해서 요청을 막지 않는다.
        // "있으면 쓰고, 없으면 그냥 다음 필터로 넘기는" 구조를 유지하기 위함
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // 헤더에 토큰이 없을 경우에만 쿠키에서 accessToken을 찾는다.
        // (헤더 우선, 쿠키 보조 전략)
        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        System.out.println("final token = " + token);

        // 토큰이 없거나 유효하지 않다고 해서 여기서 요청을 차단하지 않는다.
        // 토큰이 "있고 + 유효하고 + 아직 인증이 없는 경우"에만
        //    SecurityContext에 Authentication을 세팅
        if (token != null
                && jwtUtil.validateToken(token)
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            String email = jwtUtil.getEmailFromToken(token);
//            String role = jwtUtil.getRoleFromToken(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_USER"))
//                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            // 여기서 인증 정보를 세팅만 하고,
            // 실제 접근 허용/차단 판단은 SecurityConfig에게
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println(" Authentication SET for " + email);
        }

        // JWT 필터는 항상 다음 필터로 요청을 넘긴다.
        // (permitAll / authenticated 판단은 SecurityConfig에서 처리)
        filterChain.doFilter(request, response);
    }
}
