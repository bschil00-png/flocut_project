//package com.flocut.demo.domain.admin.controller;
//
//import com.flocut.demo.domain.admin.dto.request.AdminMemberRoleUpdateRequest;
//import com.flocut.demo.domain.admin.dto.request.AdminMemberStatusUpdateRequest;
//import com.flocut.demo.domain.admin.dto.request.AdminTwoFactorResetRequest;
//import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
//import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
//import com.flocut.demo.domain.admin.service.AdminMemberService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin/members")
//@RequiredArgsConstructor
//public class AdminMemberController {
//
//    private final AdminMemberService adminMemberService;
//
//    // 1️⃣ 회원 목록 조회
//    @GetMapping
//    public Page<AdminMemberResponseDTO> getMembers(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size
//    ) {
//        return adminMemberService.getMembers(page, size);
//    }
//
//    // 2️⃣ 회원 상태 변경
//    @PatchMapping("/{memberId}/status")
//    public void updateStatus(
//            @PathVariable Long memberId,
//            @RequestBody AdminMemberStatusUpdateRequest request
//    ) {
//        adminMemberService.updateMemberStatus(
//                memberId,
//                request.getStatus(),
//                request.getReason()
//        );
//    }
//
//    // 3️⃣ 회원 권한 변경
//    @PatchMapping("/{memberId}/role")
//    public void updateRole(
//            @PathVariable Long memberId,
//            @RequestBody AdminMemberRoleUpdateRequest request
//    ) {
//        adminMemberService.updateMemberRole(
//                memberId,
//                request.getRole(),
//                request.getReason()
//        );
//    }
//
//    // 4️⃣ 2FA 초기화
//    @PatchMapping("/{memberId}/2fa/reset")
//    public void resetTwoFactor(
//            @PathVariable Long memberId,
//            @RequestBody AdminTwoFactorResetRequest request
//    ) {
//        adminMemberService.resetTwoFactor(memberId, request.getReason());
//    }
//
//    // 5️⃣ 로그인 이력 조회
//    @GetMapping("/{memberId}/login-history")
//    public List<AdminLoginHistoryResponseDTO> getLoginHistory(
//            @PathVariable Long memberId
//    ) {
//        return adminMemberService.getLoginHistory(memberId);
//    }
//}
