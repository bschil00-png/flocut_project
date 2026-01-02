package com.flocut.demo.domain.member.dto.RequestDTO;

import lombok.Getter;

@Getter
public class PasswordChangeRequestDTO {
    private String token;
    private String newPassword;
}