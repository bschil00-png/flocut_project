package com.flocut.demo.global.email;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {

        String verifyUrl = "http://localhost:8080/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[Flocut] 이메일 인증을 완료해주세요");
        message.setText("아래 링크를 클릭하여 이메일 인증을 완료해주세요:\n" + verifyUrl);


        try {
            mailSender.send(message);
            System.out.println("📧 메일 발송 성공: " + toEmail);
        } catch (Exception e) {
            System.out.println("❌ 메일 발송 실패: " + e.getMessage());
            throw new RuntimeException("이메일 발송 실패");
        }

    }
}
