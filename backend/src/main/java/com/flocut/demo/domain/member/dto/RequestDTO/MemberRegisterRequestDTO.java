package com.flocut.demo.domain.member.dto.RequestDTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberRegisterRequestDTO {

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String tel;

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
