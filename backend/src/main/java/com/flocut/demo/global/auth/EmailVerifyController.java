package com.flocut.demo.global.auth;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequiredArgsConstructor
public class EmailVerifyController {

    private final MemberRepository memberRepository;

    @GetMapping("/auth/verify")
    public String verifyEmail(@RequestParam("token") String token) {

        // 1) 토큰으로 회원 찾기
        Member member = memberRepository.findByEmailVerifyToken(token)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못되었거나 만료된 인증 링크입니다.")
                );

        // 2) 이미 인증된 경우
        if (Boolean.TRUE.equals(member.getEmailVerified())) {
            return "redirect:http://localhost:3000/login?verified=already";
        }

        // 3) 인증 완료 처리
        member.setEmailVerified(true);
        member.setStatus(MemberStatus.ACTIVE);
        member.setEmailVerifyToken(null);
        memberRepository.save(member);

        // 4) 프론트로 리다이렉트
        return "redirect:http://localhost:3000/login?verified=true";
    }

}
