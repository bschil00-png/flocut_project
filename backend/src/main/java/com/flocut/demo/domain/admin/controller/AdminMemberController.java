package com.flocut.demo.domain.admin.controller;

import com.flocut.demo.domain.admin.dto.request.AdminMemberRoleUpdateRequest;
import com.flocut.demo.domain.admin.dto.request.AdminMemberStatusUpdateRequest;
import com.flocut.demo.domain.admin.service.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    //회원상태(status) 변경
    @PatchMapping("/{memberId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long memberId,
            @RequestBody AdminMemberStatusUpdateRequest request
    ) {
        adminMemberService.updateMemberStatus(
                memberId,
                request.getStatus(),
                request.getReason()
        );
        return ResponseEntity.noContent().build();
    }

    //회원권한(role) 변경
    @PatchMapping("/{memberId}/role")
    public ResponseEntity<Void> updateRole(
            @PathVariable Long memberId,
            @RequestBody AdminMemberRoleUpdateRequest request
    ) {
        adminMemberService.updateMemberRole(
                memberId,
                request.getRole(),
                request.getReason()
        );
        return ResponseEntity.noContent().build();
    }
}
