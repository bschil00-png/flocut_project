package com.flocut.demo.domain.member.dto.RequestDTO;

import lombok.Getter;

@Getter
public class PasswordUpdateRequestDTO {
    private String currentPassword;
    private String newPassword;
}