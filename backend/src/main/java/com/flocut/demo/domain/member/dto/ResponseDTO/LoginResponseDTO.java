package com.flocut.demo.domain.member.dto.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
//    dto 로 받은 이유 : “로그인한 회원의 정보 묶음”이라는 도메인 의미를 가진 객체
    private Long memberId;
    private String token;
    private String refreshToken;
}
