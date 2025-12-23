package com.flocut.demo.global.auth;

import com.flocut.demo.domain.admin.entity.LoginHistory;
import com.flocut.demo.domain.admin.repository.LoginHistoryRepository;
import com.flocut.demo.domain.member.dto.ResponseDTO.LoginResponseDTO;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final LoginHistoryRepository loginHistoryRepository;

    @Value("${oauth.google.client-id}")
    private String clientId;

    @Value("${oauth.google.client-secret}")
    private String clientSecret;

    @Value("${oauth.google.redirect-uri}")
    private String redirectUri;

    public LoginResponseDTO processGoogleLogin(String code) {

        // 1️⃣ Google access_token 요청
        String tokenUrl = "https://oauth2.googleapis.com/token";

        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("redirect_uri", redirectUri);
        params.put("grant_type", "authorization_code");

        Map<String, Object> tokenResponse =
                restTemplate.postForObject(tokenUrl, params, Map.class);

        System.out.println("tokenResponse = " + tokenResponse);

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new RuntimeException("구글 토큰 요청 실패");
        }

        String googleAccessToken = (String) tokenResponse.get("access_token");

        // 2️⃣ 사용자 정보 요청
        String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + googleAccessToken);

        ResponseEntity<Map> userInfoResponse =
                restTemplate.exchange(
                        userInfoUrl,
                        HttpMethod.GET,
                        new HttpEntity<>(headers),
                        Map.class
                );

        Map<String, Object> userInfo = userInfoResponse.getBody();

        if (userInfo == null || !userInfo.containsKey("email")) {
            throw new RuntimeException("구글 사용자 정보 조회 실패");
        }

        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        // 3️⃣ 회원 조회 / 자동 가입
        Member member = memberRepository.findByEmail(email)
                .orElseGet(() -> memberRepository.save(
                        Member.builder()
                                .email(email)
                                .name(name)
                                .password(null)
                                .emailVerified(true)
                                .status(MemberStatus.ACTIVE)
                                .build()
                ));
        loginHistoryRepository.save(
                LoginHistory.create(
                        member,
                        null,
                        "GOOGLE_LOGIN"
                )
        );



        // 4️⃣ 🔥 Access / Refresh Token 생성
//        String accessToken = jwtUtil.generateAccessToken(email);
//        String refreshToken = jwtUtil.generateRefreshToken(email);
        String accessToken = jwtUtil.generateAccessToken(
                member.getEmail(),
                member.getRole().name()
        );

        String refreshToken = jwtUtil.generateRefreshToken(
                member.getEmail(),
                member.getRole().name()
        );

        // 5️⃣ 🔥 Redis 저장
        redisTemplate.opsForValue().set(
                "refresh:" + email,
                refreshToken,
//                7,
//                TimeUnit.DAYS
                20,
                TimeUnit.MINUTES
        );

        // ❗ GoogleOAuthService는 "쿠키를 직접 다루지 않는다"
        // → Controller에서 쿠키 설정

        return new LoginResponseDTO(
                member.getMemberId(),
                accessToken,
                refreshToken
        );
    }
}
