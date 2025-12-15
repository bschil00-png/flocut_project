package com.flocut.demo.global.auth;

import com.flocut.demo.domain.member.entity.Member;
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

    // http://localhost:8080/auth/verify?token=xxx
//    @GetMapping("/auth/verify")
//    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
//
//        // 1) 토큰으로 회원 찾기
//        Member member = memberRepository.findByEmailVerifyToken(token)
//                .orElseThrow(() ->
//                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못되었거나 만료된 인증 링크입니다.")
//                );
//
//        // 2) 이미 인증된 경우
//        if (Boolean.TRUE.equals(member.getEmailVerified())) {
//            return ResponseEntity.ok("이미 이메일 인증이 완료된 계정입니다.");
//        }
//
//        // 3) 인증 완료 처리
//        member.setEmailVerified(true);
//        member.setEmailVerifyToken(null);  // 토큰 한 번 쓰면 제거
//        memberRepository.save(member);
//
//        // 4) 간단한 텍스트 응답 (나중에 프론트 페이지로 리다이렉트해도 됨)
//        return ResponseEntity.ok("이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.");
//    }
    @GetMapping("/auth/verify")
    public String verifyEmail(@RequestParam("token") String token) {

        Member member = memberRepository.findByEmailVerifyToken(token)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못되었거나 만료된 인증 링크입니다.")
                );

        if (Boolean.TRUE.equals(member.getEmailVerified())) {
            return "redirect:http://localhost:3000/login?verified=already";
        }

        member.setEmailVerified(true);
        member.setEmailVerifyToken(null);
        memberRepository.save(member);

        return "redirect:http://localhost:3000/login?verified=true";
    }

}
