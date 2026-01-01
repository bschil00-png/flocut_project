package com.flocut.demo.domain.member.dto.RequestDTO;

import lombok.Getter;
import jakarta.validation.constraints.Pattern;

@Getter
public class MemberUpdateRequestDTO {


    private String name;

    // 전화번호는 선택
    @Pattern(
            regexp = "^$|^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$",
            message = "전화번호 형식이 올바르지 않습니다."
    )
    private String tel;

    // 프로필 이미지 URL (선택)
    private String profileImage;
}