package com.flocut.demo.domain.member.dto.RequestDTO;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class EmailResendRequestDTO {

    @Email
    @NotBlank
    private String email;
}
