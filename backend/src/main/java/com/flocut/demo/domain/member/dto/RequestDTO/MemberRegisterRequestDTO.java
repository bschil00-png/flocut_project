package com.flocut.demo.domain.member.dto.RequestDTO;

import jakarta.persistence.Column;
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

    // 이거 하실거면 진짜로 이미지 필요한데
//    @Column(name = "profile_image", length = 500)
//    private String profileImage; 엔티티에서 선택값으로 해두고 여기서
//    @NotBlank (not null) 조건 걸어버리면
//    오류납니다. 확인 부탁드립니다.
//    @NotBlank
    private String profileImage;
}
