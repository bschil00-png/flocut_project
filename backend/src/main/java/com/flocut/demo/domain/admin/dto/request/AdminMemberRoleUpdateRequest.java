package com.flocut.demo.domain.admin.dto.request;

import com.flocut.demo.domain.member.entity.UserRole;
import lombok.Getter;

@Getter
public class AdminMemberRoleUpdateRequest {
    private UserRole role;
    private String reason;
}
