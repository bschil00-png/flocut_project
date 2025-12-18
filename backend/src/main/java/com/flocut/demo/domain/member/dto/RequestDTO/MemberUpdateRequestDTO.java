package com.flocut.demo.domain.member.dto.RequestDTO;

import lombok.Getter;

@Getter
public class MemberUpdateRequestDTO {

    // 선택 수정
    private String name;
    private String tel;
    private String profileImage;
}