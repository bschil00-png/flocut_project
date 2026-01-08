package com.flocut.demo.global.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
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
 public void sendLoginGuideMail(String toEmail) {

     SimpleMailMessage message = new SimpleMailMessage();
     message.setTo(toEmail);
     message.setSubject("[FloCut] 로그인 안내");
     message.setText(
             "회원님의 전화번호로 가입된 계정이 확인되었습니다.\n\n" +
                     "FloCut은 이메일 주소를 아이디로 사용합니다.\n" +
                     "이 이메일 주소로 로그인해 주세요.\n\n" +
                     "본 메일은 계정 확인 요청에 의해 발송되었습니다."
     );

     mailSender.send(message);
 }
}
