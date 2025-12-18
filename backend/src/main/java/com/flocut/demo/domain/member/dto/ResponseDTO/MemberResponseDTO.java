package com.flocut.demo.domain.member.dto.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class MemberResponseDTO {

    private Long memberId;       // PK
    private String email;        // 이메일
    private String name;         // 이름
    private String profileImage; // 프로필
    private String status;       // READY / ACTIVE
    private LocalDate regdate;   // 가입일
    private String lastLoginDate; // 정렬 필터용
}
