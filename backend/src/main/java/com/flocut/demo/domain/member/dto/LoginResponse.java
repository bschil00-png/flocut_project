package com.flocut.demo.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
//    dto 로 받은 이유
    private MemberDto member;
    private String token;
}
