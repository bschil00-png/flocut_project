package com.flocut.demo.global.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {

        String verifyUrl = "http://localhost:8080/auth/verify?token=" + token;

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            String htmlContent = """
                <html>
                  <body style="font-family: Arial, sans-serif;">
                    <h2>이메일 인증</h2>
                    <p>아래 버튼을 클릭하여 이메일 인증을 완료해주세요.</p>

                    <a href="%s"
                       style="
                         display:inline-block;
                         padding:12px 20px;
                         background-color:#ff5a5f;
                         color:#ffffff;
                         text-decoration:none;
                         border-radius:6px;
                         font-weight:bold;
                       ">
                       이메일 인증하기
                    </a>

                    <p style="margin-top:20px; font-size:14px;">
                      버튼이 동작하지 않으면 아래 링크를 복사해 브라우저에 붙여넣어 주세요.
                    </p>

                    <p style="font-size:13px; color:#555;">
                      %s
                    </p>
                  </body>
                </html>
            """.formatted(verifyUrl, verifyUrl);

            helper.setTo(toEmail);
            helper.setSubject("[FLOCUT] 이메일 인증을 완료해주세요");
            helper.setText(htmlContent, true); // ⭐ HTML 메일

            mailSender.send(message);
            System.out.println("📧 인증 메일 발송 성공: " + toEmail);

        } catch (MessagingException e) {
            System.out.println("❌ 메일 발송 실패: " + e.getMessage());
            throw new RuntimeException("이메일 발송 실패", e);
        }
    }
}
