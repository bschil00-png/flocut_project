package com.flocut.demo.domain.member.resolver;

import com.flocut.demo.domain.member.dto.ResponseDTO.LoginResponseDTO;
import com.flocut.demo.domain.member.dto.MemberDto;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.global.jwt.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MemberResolver {

    private final MemberService memberService;
    private final MemberMapper memberMapper;
    private final JwtUtil jwtUtil;

    // =========================
    // 회원가입
    // =========================
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

    // =========================
    // ❗ GraphQL 로그인 (쿠키 ❌)
    // =========================
//    @MutationMapping
//    public LoginResponseDTO login(
//            @Argument String email,
//            @Argument String password
//    ) {
//        Member member = memberService.login(email, password);
//        String token = jwtUtil.generateToken(email);
//
//        // ❗ GraphQL에서는 쿠키를 절대 다루지 않는다
//        return new LoginResponseDTO(member.getMemberId(), token);
//    }

    // =========================
    // 회원 조회
    // =========================
    @QueryMapping
    public MemberDto member(@Argument Long id) {
        Member member = memberService.getMember(id);
        return memberMapper.toDto(member);
    }

    // =========================
    // 내 정보 조회
    // =========================
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
