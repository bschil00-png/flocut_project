package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.LoginResponse;
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

    /** 🔥 GET 방식 */
    @GetMapping("/login")
    public ResponseEntity<LoginResponse> googleLoginGet(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = googleOAuthService.processGoogleLogin(code);

        // === 쿠키 생성 ===
        ResponseCookie cookie = ResponseCookie.from("token", loginResponse.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(loginResponse);
    }

    /** 🔥 POST 방식 */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> googleLoginPost(
            @RequestBody Map<String, String> body,
            HttpServletResponse response
    ) {
        String code = body.get("code");

        LoginResponse loginResponse = googleOAuthService.processGoogleLogin(code);

        // === 쿠키 생성 ===
        ResponseCookie cookie = ResponseCookie.from("token", loginResponse.getToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(loginResponse);
    }
}
