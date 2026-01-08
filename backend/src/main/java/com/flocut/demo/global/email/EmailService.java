package com.flocut.demo.global.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

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
                <body style="
                  margin:0;
                  padding:0;
                  background-color:#f7f7f7;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                  <table width="100%%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:40px 16px;">
              
                        <table width="100%%" max-width="480" cellpadding="0" cellspacing="0"
                               style="
                                 background:#ffffff;
                                 border-radius:12px;
                                 padding:32px;
                                 box-shadow:0 4px 12px rgba(0,0,0,0.04);
                               ">
                          <tr>
                            <td style="text-align:left;">
                              <h2 style="
                                margin:0 0 12px;
                                font-size:20px;
                                font-weight:600;
                                color:#111;
                              ">
                                이메일 인증
                              </h2>
              
                              <p style="
                                margin:0 0 24px;
                                font-size:14px;
                                line-height:1.6;
                                color:#444;
                              ">
                                FLOCUT 서비스를 이용하기 위해 이메일 인증이 필요합니다.<br/>
                                아래 버튼을 눌러 인증을 완료해 주세요.
                              </p>
              
                              <a href="%s"
                                 style="
                                   display:block;
                                   width:100%%;
                                   text-align:center;
                                   padding:14px 0;
                                   background:#111;
                                   color:#ffffff;
                                   text-decoration:none;
                                   border-radius:8px;
                                   font-size:14px;
                                   font-weight:600;
                                 ">
                                이메일 인증하기
                              </a>
              
                              <p style="
                                margin:24px 0 8px;
                                font-size:12px;
                                color:#666;
                              ">
                                버튼이 작동하지 않으면 아래 링크를 복사해 주세요.
                              </p>
              
                              <p style="
                                font-size:12px;
                                color:#888;
                                word-break:break-all;
                              ">
                                %s
                              </p>
              
                              <hr style="border:none; border-top:1px solid #eee; margin:32px 0;"/>
              
                              <p style="
                                font-size:11px;
                                color:#999;
                                line-height:1.5;
                              ">
                                본 메일은 발신 전용입니다.<br/>
                                본인이 요청하지 않았다면 메일을 무시해 주세요.
                              </p>
                            </td>
                          </tr>
                        </table>
              
                      </td>
                    </tr>
                  </table>
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


 //  아이디 찾기시 메일발송
 public void sendFindEmailResultMail(
         String toEmail,
         List<String> maskedEmails
 ) {
     MimeMessage message = mailSender.createMimeMessage();

     try {
         MimeMessageHelper helper =
                 new MimeMessageHelper(message, true, "UTF-8");

         String emailListHtml = maskedEmails.stream()
                 .map(e -> "<li>" + e + "</li>")
                 .reduce("", String::concat);

         String htmlContent = """
                <html>
                  <body style="font-family: Arial, sans-serif;">
                    <h2>아이디(이메일) 찾기 결과 안내</h2>
                    <p>회원님의 전화번호로 가입된 이메일 계정은 다음과 같습니다.</p>
                    <ul>
                      %s
                    </ul>
                    <p>
                      위 이메일 주소 중 하나로 로그인해 주세요.<br/>
                      비밀번호가 기억나지 않으면 비밀번호 재설정을 이용해 주세요.
                    </p>
                    <hr/>
                    <p style="font-size:12px; color:#888;">
                      본 메일은 요청에 의해 자동 발송되었습니다.
                    </p>
                  </body>
                </html>
                """.formatted(emailListHtml);

         helper.setTo(toEmail);
         helper.setSubject("[FloCut] 아이디(이메일) 찾기 결과 안내");
         helper.setText(htmlContent, true);

         mailSender.send(message);

     } catch (MessagingException e) {
         throw new RuntimeException("아이디 찾기 메일 발송 실패", e);
     }
 }
}
