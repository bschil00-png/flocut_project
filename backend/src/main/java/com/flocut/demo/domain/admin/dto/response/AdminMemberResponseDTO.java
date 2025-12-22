package com.flocut.demo.domain.admin.dto.response;

import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;

@Getter
@AllArgsConstructor
public class AdminMemberResponseDTO {
    private Long memberId;
    private String email;
    private String name;
    private MemberStatus status;
    private UserRole role;
    private Date regdate;
}

