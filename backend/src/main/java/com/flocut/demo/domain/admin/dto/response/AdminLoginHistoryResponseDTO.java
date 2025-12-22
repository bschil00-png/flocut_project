package com.flocut.demo.domain.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class AdminLoginHistoryResponseDTO {
    private LocalDate loginAt;
    private String ip;
    private String device;
}

