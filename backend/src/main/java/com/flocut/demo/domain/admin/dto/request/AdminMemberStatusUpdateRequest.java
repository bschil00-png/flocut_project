package com.flocut.demo.domain.admin.dto.request;

import com.flocut.demo.domain.member.entity.MemberStatus;
import lombok.Getter;

@Getter
public class AdminMemberStatusUpdateRequest {
    private MemberStatus status;
    private String reason;
}