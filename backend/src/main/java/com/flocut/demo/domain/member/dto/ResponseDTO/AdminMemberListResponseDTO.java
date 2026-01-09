package com.flocut.demo.domain.member.dto.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminMemberListResponseDTO {

    private Long memberId;     // PK
    private String email;      // 이메일
    private String name;       // 이름
    private String status;     // 상태
    private LocalDateTime regdate; // 가입일
}