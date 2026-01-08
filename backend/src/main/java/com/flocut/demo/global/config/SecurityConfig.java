package com.flocut.demo.global.config;

import com.flocut.demo.global.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // JWT 기반 → CSRF 비활성화
                .csrf(csrf -> csrf.disable())

                // CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 세션 미사용
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 인증 없이 접근
                        .requestMatchers(
                                "/auth/register",
                                "/auth/login",
                                "/auth/logout",
                                "/auth/refresh",
                                "/auth/verify",
                                "/auth/find-email",
                                "/auth/me",
                                "/auth/google/**",
                                "/auth/password/reset-request",
                                "/auth/password/reset"
                        ).permitAll()

                        .requestMatchers("/api/ai/**").permitAll()

                        // GraphiQL (개발용 UI)
                        .requestMatchers(
                                "/graphiql",
                                "/graphiql/**"
                        ).permitAll()


                        .requestMatchers("/api/sessions/**").authenticated()
                        // 🔒 GraphQL 엔드포인트는 인증 필수
                        .requestMatchers("/graphql").permitAll()

                        // 🔒 관리자 REST API
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 그 외
                        .anyRequest().authenticated()
                );

        // JWT 필터
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
