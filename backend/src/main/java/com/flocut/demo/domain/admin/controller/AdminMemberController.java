package com.flocut.demo.domain.admin.controller;

import com.flocut.demo.domain.admin.dto.request.AdminMemberRoleUpdateRequest;
import com.flocut.demo.domain.admin.dto.request.AdminMemberStatusUpdateRequest;
import com.flocut.demo.domain.admin.service.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    // 2️⃣ 회원 상태 변경
    @PatchMapping("/{memberId}/status")
    public void updateStatus(
            @PathVariable Long memberId,
            @RequestBody AdminMemberStatusUpdateRequest request
    ) {
        adminMemberService.updateMemberStatus(
                memberId,
                request.getStatus(),
                request.getReason()
        );
    }

    // 3️⃣ 회원 권한 변경
    @PatchMapping("/{memberId}/role")
    public void updateRole(
            @PathVariable Long memberId,
            @RequestBody AdminMemberRoleUpdateRequest request
    ) {
        adminMemberService.updateMemberRole(
                memberId,
                request.getRole(),
                request.getReason()
        );
    }
}
