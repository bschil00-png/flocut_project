package com.flocut.demo.domain.member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDTO {

    private Long memberId;
    private String email;
    private String name;
    private String tel;
    private String profileImage;
    private String status;
    private Boolean emailVerified;
    private String regdate;
    private String moddate;
    private String role;
}