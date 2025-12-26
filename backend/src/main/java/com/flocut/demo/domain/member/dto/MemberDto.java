package com.flocut.demo.domain.member.dto;

import com.flocut.demo.domain.member.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDto {

    private Long memberId;
    private String email;
    private String name;
    private String tel;
    private String profileImage;
    private String status;
    private Boolean emailVerified;
    private String regdate;
    private String moddate;
    private UserRole role;
}