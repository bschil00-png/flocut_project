package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.ResponseDTO.LoginResponseDTO;
import com.flocut.demo.global.auth.GoogleOAuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/google")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GoogleLoginController {

    private final GoogleOAuthService googleOAuthService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> googleLoginPost(
            @RequestBody Map<String, String> body
    ) {
        String code = body.get("code");

        LoginResponseDTO loginResponse =
                googleOAuthService.processGoogleLogin(code);

        // 🔥 accessToken 쿠키
        ResponseCookie accessCookie =
                ResponseCookie.from("accessToken", loginResponse.getToken())
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(Duration.ofMinutes(5))
                        .build();

        // 🔥 refreshToken 쿠키
        ResponseCookie refreshCookie =
                ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")          // ⭐ 반드시 /
                        .maxAge(Duration.ofMinutes(20))
                        .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(loginResponse);
    }
}
