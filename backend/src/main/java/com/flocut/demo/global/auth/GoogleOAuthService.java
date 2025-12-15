package com.flocut.demo.global.auth;

import com.flocut.demo.domain.member.dto.LoginResponse;
import com.flocut.demo.domain.member.dto.MemberDto;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final MemberRepository memberRepository;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;

    @Value("${oauth.google.client-id}")
    private String clientId;

    @Value("${oauth.google.client-secret}")
    private String clientSecret;

    @Value("${oauth.google.redirect-uri}")
    private String redirectUri;

    public LoginResponse processGoogleLogin(String code) {

        // 1. code -> access_token 교환
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

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new RuntimeException("구글 토큰 요청 실패");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2. access_token으로 사용자 정보 가져오기
        String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> userInfoResponse =
                restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);

        Map<String, Object> userInfo = userInfoResponse.getBody();

        if (userInfo == null || !userInfo.containsKey("email")) {
            throw new RuntimeException("구글 사용자 정보를 가져오지 못했습니다.");
        }

        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        // 3. DB에서 회원 조회 / 없으면 자동 회원가입
        Member member = memberRepository.findByEmail(email)
                .orElseGet(() -> {
                    Member newMember = Member.builder()
                            .email(email)
                            .name(name)
                            .emailVerified(true)   // 구글 이메일이면 이미 인증된 것으로 처리
                            .password("")          // 소셜로그인이라 비밀번호는 비워둠
                            .build();
                    return memberRepository.save(newMember);
                });

        // 4. JWT 생성
        String token = jwtUtil.generateToken(email);

        MemberDto memberDto = memberMapper.toDto(member);

        return new LoginResponse(memberDto, token);
    }
}
