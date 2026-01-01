package com.flocut.demo.domain.member.dto.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class MemberLoginHistoryResponseDTO {

    private Long loginHistoryId; // PK
    private String ip;           // 로그인 IP
    private String device;       // 브라우저 / 기기
    private LocalDate loginDate; // 날짜
}