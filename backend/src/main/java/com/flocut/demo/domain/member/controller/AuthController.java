package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.admin.entity.LoginHistory;
import com.flocut.demo.domain.admin.repository.LoginHistoryRepository;
import com.flocut.demo.domain.member.dto.RequestDTO.MemberRegisterRequestDTO;
import com.flocut.demo.domain.member.dto.RequestDTO.LoginRequestDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.ErrorResponseDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.LoginResponseDTO;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.global.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final LoginHistoryRepository loginHistoryRepository;

    // 회원가입

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid MemberRegisterRequestDTO request) {

        Member member = Member.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .tel(request.getTel())
                .status(MemberStatus.READY)
                .emailVerified(false)
                .emailVerifyToken(UUID.randomUUID().toString())
                .build();

        Member saved = memberService.register(member);
        System.out.println("REGISTER TEL = [" + request.getTel() + "]");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(memberMapper.toDto(saved));

    }



    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request, HttpServletRequest httpRequest) {

        try {

            Member member = memberService.login(
                    request.getEmail(), request.getPassword()
            );
            loginHistoryRepository.save(
                    LoginHistory.create(
                            member,
                            httpRequest.getRemoteAddr(),
                            httpRequest.getHeader("User-Agent")
                    )
            );


            String accessToken = jwtUtil.generateAccessToken(
                    member.getEmail(),
                    member.getRole().name()
            );

            String refreshToken = jwtUtil.generateRefreshToken(
                    member.getEmail(),
                    member.getRole().name()
            );

            //  Redis 저장 (key = refresh:{email})
            redisTemplate.opsForValue().set(
                    "refresh:" + member.getEmail(),
                    refreshToken,
                    7,
                    TimeUnit.DAYS
//                    20,
//                    TimeUnit.MINUTES
            );

            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofMinutes(15))
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/") //
                    .maxAge(Duration.ofDays(7))
//                    .maxAge(Duration.ofMinutes(20))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(new LoginResponseDTO(member.getMemberId(), accessToken,refreshToken)); //access토큰과 refresh토근 설정인데 일단 null로 설정

        } catch (IllegalArgumentException  e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponseDTO(e.getMessage()));
        }catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDTO("서버 오류가 발생했습니다."));
        }
    }

    // refresh

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request) {

        Cookie cookie = WebUtils.getCookie(request, "refreshToken");
        if (cookie == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String refreshToken = cookie.getValue();

        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtUtil.getEmailFromToken(refreshToken);
        String savedToken = redisTemplate.opsForValue().get("refresh:" + email);

        if (!refreshToken.equals(savedToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Member member = memberService.findByEmail(email);

        //  새 accessToken 발급
        String newAccessToken = jwtUtil.generateAccessToken(
                member.getEmail(),
                member.getRole().name()
        );

        //  SecurityContext 세팅
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        member.getEmail(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + member.getRole().name()))
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResponseCookie newAccessCookie =
                ResponseCookie.from("accessToken", newAccessToken)
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(Duration.ofMinutes(15))
                        .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, newAccessCookie.toString())
                .build();
    }


    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        Cookie refreshCookie = WebUtils.getCookie(request, "refreshToken");

        if (refreshCookie != null) {
            String refreshToken = refreshCookie.getValue();

            if (jwtUtil.validateToken(refreshToken)) {
                String email = jwtUtil.getEmailFromToken(refreshToken);
                redisTemplate.delete("refresh:" + email);
            }
        }

        ResponseCookie deleteAccessToken = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie deleteRefreshToken = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteAccessToken.toString())
                .header(HttpHeaders.SET_COOKIE, deleteRefreshToken.toString())
                .build();
    }

}
