package com.flocut.demo.domain.member.service;

import com.flocut.demo.domain.member.dto.ResponseDTO.MemberProfileResponseDTO;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.global.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;


import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final MemberMapper memberMapper;

    public Member register(Member member) {
        //   이메일 중복 체크
        memberRepository.findByEmail(member.getEmail())
                .ifPresent(m -> {
                    throw new RuntimeException("이미 사용 중인 이메일입니다.");
                });

        //  비밀번호 암호화
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        //  이메일 인증 관련 값 설정
        member.setEmailVerified(false);                        // 처음은 미인증 상태
        member.setEmailVerifyToken(UUID.randomUUID().toString());   // 랜덤 토큰 생성

        Member saved = memberRepository.save(member);

        //  이메일 발송
        emailService.sendVerificationEmail(saved.getEmail(), saved.getEmailVerifyToken());
        System.out.println("=== REGISTER SERVICE CALLED ===");

        return saved;
    }

    public Member login(String email, String password) {


        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> {
                    return new IllegalArgumentException("회원이 존재하지 않습니다.");
                });
        //RuntimeException은 너무 포괄적인 오류 IllegalArgumentException은 잘못된 파라미터를 던져줬다는 오류


        if (member.getStatus() == MemberStatus.DELETED) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        if (member.getStatus() == MemberStatus.DISABLED) {
            throw new IllegalArgumentException("차단된 회원입니다.");
        }

        boolean match = passwordEncoder.matches(password, member.getPassword());

        if (!match) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if (member.getStatus() != MemberStatus.ACTIVE) {
            throw new IllegalArgumentException("이메일 인증이 필요합니다.");
        }

        System.out.println("✅ 로그인 성공: " + member.getEmail());
        System.out.println("=== LOGIN DEBUG END ===");

        return member;
    }

    //     마이페이지용 멤버 조회
    // 마이페이지용 멤버 조회
    public MemberProfileResponseDTO getMyProfile() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null
                || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            throw new IllegalStateException("UNAUTHENTICATED");
        }

        // 여기까지 왔다는 건
        // JwtAuthFilter에서 accessToken으로 인증 세팅이 된 상태
        String email = auth.getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("회원 없음"));

        if (member.getStatus() == MemberStatus.DELETED) {
            throw new IllegalStateException("탈퇴한 회원입니다.");
        }

        return memberMapper.toProfileDto(member);
    }

    @Transactional
    public void updateMyProfile(
            String name,
            String tel,
            String profileImage
    ) {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("회원 없음"));

        // 🔹 null이 아닌 것만 수정
        if (name != null && !name.isBlank()) {
            member.setName(name);
        }

        if (tel != null) {
            member.setTel(tel);
        }

        if (profileImage != null) {
            member.setProfileImage(profileImage);
        }

    }

    @Transactional
    public void deleteMyAccount() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("인증 정보 없음");
        }

        String email = auth.getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("회원 없음"));

        // 이미 탈퇴한 경우 방어
        if (member.getStatus() == MemberStatus.DELETED) {
            return;
        }

        // 🔥 소프트 삭제
        member.setStatus(MemberStatus.DELETED);

        // 선택: 개인정보 최소화 (권장)
        member.setTel(null);
        member.setProfileImage(null);
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