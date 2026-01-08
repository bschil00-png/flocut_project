package com.flocut.demo.domain.member.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.PasswordResetToken;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.member.repository.PasswordResetTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetService {

    private final MemberRepository memberRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    //  이메일 발송
    public void requestReset(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일"));

        tokenRepository.findActiveToken(member, LocalDateTime.now())
                .ifPresent(token -> {
                    throw new RuntimeException("이미 비밀번호 재설정 메일을 보냈습니다.");
                });

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                PasswordResetToken.create(member, token);

        tokenRepository.save(resetToken);

        sendMail(member.getEmail(), token);
    }

    //  비밀번호 변경
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 토큰"));

        if (resetToken.isUsed()
                || resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("만료된 토큰");
        }

        Member member = resetToken.getMember();

        // 기존 비밀번호와 동일한지 체크
        if (member.getPassword() != null &&
                passwordEncoder.matches(newPassword, member.getPassword())) {
            throw new RuntimeException("기존 비밀번호와 동일합니다.");
        }

        //  새 비밀번호로 변경
        member.changePassword(passwordEncoder.encode(newPassword));

        //  토큰 사용 처리
        resetToken.markAsUsed();
    }

    private void sendMail(String email, String token) {
        // 실제론 HTML 템플릿 권장
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[FloCut] 비밀번호 재설정");
        message.setText(
                "비밀번호 재설정 링크:\n" +
                        "http://localhost:3000/reset-password?token=" + token
        );

        mailSender.send(message);
    }
}

