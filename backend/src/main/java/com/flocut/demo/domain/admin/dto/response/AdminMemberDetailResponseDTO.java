package com.flocut.demo.domain.admin.dto.response;

import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class AdminMemberDetailResponseDTO {

    private Long memberId;
    private String email;
    private String name;
    private String tel;
    private MemberStatus status;
    private UserRole role;
    private Boolean emailVerified;
    private LocalDateTime regdate;

}
