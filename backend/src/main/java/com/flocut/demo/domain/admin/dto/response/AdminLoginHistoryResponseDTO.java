package com.flocut.demo.domain.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@Getter
@AllArgsConstructor
public class AdminLoginHistoryResponseDTO {
    private Date loginAt;
    private String ip;
    private String userAgent;
}

