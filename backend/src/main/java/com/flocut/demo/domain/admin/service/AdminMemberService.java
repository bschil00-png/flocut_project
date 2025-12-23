package com.flocut.demo.domain.admin.service;

import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
import com.flocut.demo.domain.admin.entity.AdminActionLog;
import com.flocut.demo.domain.admin.repository.AdminActionLogRepository;
import com.flocut.demo.domain.admin.repository.LoginHistoryRepository;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.entity.UserRole;
import com.flocut.demo.domain.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminMemberService {

    private final MemberRepository memberRepository;
    private final AdminActionLogRepository adminActionLogRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    // 1️⃣ 회원 목록 조회
    public Page<AdminMemberResponseDTO> getMembers(int page, int size) {
        return memberRepository.findAll(
                PageRequest.of(page, size, Sort.by("regdate").descending())
        ).map(member ->
                new AdminMemberResponseDTO(
                        member.getMemberId(),
                        member.getEmail(),
                        member.getName(),
                        member.getStatus(),
                        member.getRole(),
                        member.getRegdate()
                )
        );
    }

    // 2️⃣ 회원 상태 변경
    @Transactional
    public void updateMemberStatus(Long memberId, MemberStatus status, String reason) {
        Member member = getMember(memberId);
        MemberStatus before = member.getStatus();

        member.setStatus(status);

        saveAdminLog(memberId, "STATUS_CHANGE", before.name(), status.name(), reason);
    }

    // 3️⃣ 회원 권한 변경
    @Transactional
    public void updateMemberRole(Long memberId, UserRole role, String reason) {
        Member member = getMember(memberId);
        UserRole before = member.getRole();

        member.setRole(role);

        saveAdminLog(memberId, "ROLE_CHANGE", before.name(), role.name(), reason);
    }

    // 5️⃣ 로그인 이력 조회
    public List<AdminLoginHistoryResponseDTO> getLoginHistory(Long memberId) {
        // 로그인 이력 테이블 생긴 뒤 구현
        return loginHistoryRepository
                .findByMember_MemberIdOrderByLoginDateDesc(memberId)
                .stream()
                .map(h -> new AdminLoginHistoryResponseDTO(
                        h.getLoginDate().toLocalDate(),
                        h.getIp(),
                        h.getDevice()
                ))
                .toList();
    }

    private Long getCurrentAdminId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("인증 정보 없음");
        }

        String adminEmail = authentication.getName(); // JWT sub

        Member admin = memberRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalStateException("관리자 없음"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new IllegalStateException("관리자 권한 아님");
        }

        return admin.getMemberId();
    }

    // ===== 공통 메서드 =====
    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));
    }

    private void saveAdminLog(
            Long targetMemberId,
            String actionType,
            String beforeValue,
            String afterValue,
            String reason
    ) {
        Long adminId = getCurrentAdminId(); // 🔥 핵심

        AdminActionLog log = AdminActionLog.create(
                adminId,                // 관리자
                targetMemberId,          // 대상 회원
                actionType,
                beforeValue,
                afterValue,
                reason
        );

        adminActionLogRepository.save(log);
    }
}
