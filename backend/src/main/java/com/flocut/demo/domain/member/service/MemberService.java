package com.flocut.demo.domain.member.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.global.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public Member register(Member member) {
        // ✅ 1) 이메일 중복 체크
        memberRepository.findByEmail(member.getEmail())
                .ifPresent(m -> {
                    throw new RuntimeException("이미 사용 중인 이메일입니다.");
                });

        // ✅ 2) 비밀번호 암호화
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // ✅ 3) 이메일 인증 관련 값 설정
        member.setEmailVerified(false);                        // 처음은 미인증 상태
        member.setEmailVerifyToken(UUID.randomUUID().toString());   // 랜덤 토큰 생성

        Member saved = memberRepository.save(member);

        // 📩 이메일 발송
        emailService.sendVerificationEmail(saved.getEmail(), saved.getEmailVerifyToken());
        System.out.println("=== REGISTER SERVICE CALLED ===");

        return saved;
    }

    public Member login(String email, String password) {

        System.out.println("=== LOGIN DEBUG START ===");
        System.out.println("입력 email = " + email);
        System.out.println("입력 password = " + password);

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("❌ 이메일로 회원을 찾지 못함");
                    System.out.println("=== LOGIN DEBUG END ===");
                    return new RuntimeException("회원이 존재하지 않습니다.");
                });

        System.out.println("DB 저장된 email = " + member.getEmail());
        System.out.println("DB 저장된 password hash = " + member.getPassword());

        boolean match = passwordEncoder.matches(password, member.getPassword());
        System.out.println("비밀번호 비교 결과 = " + match);

        if (!match) {
            System.out.println("❌ 비밀번호 불일치");
            System.out.println("=== LOGIN DEBUG END ===");
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        if (!member.getEmailVerified()) {
            System.out.println("❌ 이메일 인증 안됨");
            System.out.println("=== LOGIN DEBUG END ===");
            throw new RuntimeException("이메일 인증이 필요합니다.");
        }

        System.out.println("✅ 로그인 성공: " + member.getEmail());
        System.out.println("=== LOGIN DEBUG END ===");

        return member;
    }




        public void test() {
            System.out.println(passwordEncoder.encode("12345678"));
        }


    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
    }


    public Member getMember(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
    }
}