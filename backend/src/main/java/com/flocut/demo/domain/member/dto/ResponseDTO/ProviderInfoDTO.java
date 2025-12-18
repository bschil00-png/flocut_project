package com.flocut.demo.domain.member.dto.ResponseDTO;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProviderInfoDTO {

    private String provider;  // GOOGLE / KAKAO / NAVER
    private LocalDate linkedAt; // 연동 일시
}