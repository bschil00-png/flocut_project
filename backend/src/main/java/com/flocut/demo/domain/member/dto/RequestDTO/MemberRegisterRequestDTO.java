package com.flocut.demo.domain.member.dto.RequestDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;

@Getter
public class MemberRegisterRequestDTO {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    @AssertTrue(message = "약관 동의는 필수입니다.")
    private boolean agreeTerms;

    @NotBlank
    private String profileImage;
}
