package com.flocut.demo.domain.member.dto.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MemberProfileResponseDTO {

    private Long memberId;        // PK
    private String email;         // 이메일
    private String name;          // 이름
    private String tel;           // 전화번호
    private String profileImage;  // 프로필 이미지

    private String role;          // USER / ADMIN
    private String status;        // READY / ACTIVE / DISABLED / DELETED
    private String regdate;       // 가입일 (문자열)
}