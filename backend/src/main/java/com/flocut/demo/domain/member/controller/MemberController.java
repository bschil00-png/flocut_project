package com.flocut.demo.domain.member.controller;

import com.flocut.demo.domain.member.dto.RequestDTO.MemberUpdateRequestDTO;
import com.flocut.demo.domain.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    @PatchMapping("/me")
    public void updateMyProfile(
            @RequestBody @Valid MemberUpdateRequestDTO request
    ) {
        memberService.updateMyProfile(
                request.getName(),
                request.getTel(),
                request.getProfileImage()
        );
    }
    // 🔥 회원 탈퇴 (소프트 삭제)
    @DeleteMapping("/me")
    public void deleteMyAccount() {
        memberService.deleteMyAccount();
    }
}