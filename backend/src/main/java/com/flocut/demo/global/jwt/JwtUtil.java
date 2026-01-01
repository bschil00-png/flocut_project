package com.flocut.demo.global.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // JWT 생성
//    public String generateToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }

    public String generateAccessToken(String email, String role) {
//        return createToken(email, 1000 * 60 * 15); // 15분
        return createToken(email, role, 1000 * 60 * 5);
    }

    public String generateRefreshToken(String email, String role) {
//        return createToken(email, 1000 * 60 * 60 * 24 * 7); // 7일
        return createToken(email, role, 1000 * 60 * 20 );
    }

    private String createToken(String email, String role, long expireMs) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // role을 넣은 이유 :매 요청 DB 조회 제거
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expireMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("❌ JWT 만료됨");
        } catch (SignatureException e) {
            System.out.println("❌ JWT 서명 불일치");
        } catch (JwtException e) {
            System.out.println("❌ JWT 파싱 실패: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("❌ JWT 기타 오류: " + e.getMessage());
        }
        return false;
    }

    // JWT에서 email 추출
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // 🔥 role 추출
    public String getRoleFromToken(String token) {
        return getClaims(token).get("role", String.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
