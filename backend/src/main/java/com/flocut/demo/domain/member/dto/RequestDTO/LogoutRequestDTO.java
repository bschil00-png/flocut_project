package com.flocut.demo.domain.member.dto.RequestDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class LogoutRequestDTO {

    @NotNull
    private Long memberId;

    @NotBlank
    private String refreshToken;
}