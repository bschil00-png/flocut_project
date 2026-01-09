package com.flocut.demo.domain.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AdminLoginHistoryResponseDTO {
    private LocalDateTime loginAt;
    private String ip;
    private String device;
}

