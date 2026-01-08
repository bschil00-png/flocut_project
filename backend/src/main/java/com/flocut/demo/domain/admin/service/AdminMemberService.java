package com.flocut.demo.domain.admin.service;

import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberDetailResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
import com.flocut.demo.domain.admin.entity.AdminActionLog;
import com.flocut.demo.domain.admin.repository.AdminActionLogRepository;
import com.flocut.demo.domain.admin.repository.LoginHistoryRepository;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.entity.UserRole;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.global.dto.PageResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminMemberService {

    private final MemberRepository memberRepository;
    private final AdminActionLogRepository adminActionLogRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    // 관리자 회원 목록 조회
    public PageResponseDTO<AdminMemberResponseDTO> getMembers(int page, int size) {

        Page<Member> result = memberRepository.findAll(
                PageRequest.of(
                        page,
                        size,
                        Sort.by(Sort.Direction.DESC, "regdate")
                )
        );

        List<AdminMemberResponseDTO> content =
                result.getContent()
                        .stream()
                        .map(this::toAdminMemberResponse)
                        .toList();

        return new PageResponseDTO<>(
                content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber(),
                result.getSize(),
                result.hasNext()
        );
    }
//  관리자 회원 상세 조회
    public AdminMemberDetailResponseDTO getMemberDetail(Long memberId) {

        Member member = getMember(memberId);

        return new AdminMemberDetailResponseDTO(
                member.getMemberId(),
                member.getEmail(),
                member.getName(),
                member.getTel(),
                member.getStatus(),
                member.getRole(),
                member.getEmailVerified(),
                member.getRegdate()
        );
    }



    // 회원 상태 변경
    @Transactional
    public void updateMemberStatus(Long memberId, MemberStatus status, String reason) {
        Member member = getMember(memberId);
        MemberStatus before = member.getStatus();

        member.setStatus(status);

        saveAdminLog(
                memberId,
                "STATUS_CHANGE",
                before.name(),
                status.name(),
                reason
        );
    }

    // 회원 권한 변경
    @Transactional
    public void updateMemberRole(Long memberId, UserRole role, String reason) {
        Member member = getMember(memberId);
        UserRole before = member.getRole();

        member.setRole(role);

        saveAdminLog(
                memberId,
                "ROLE_CHANGE",
                before.name(),
                role.name(),
                reason
        );
    }

    // 로그인 이력 조회
    public List<AdminLoginHistoryResponseDTO> getLoginHistory(Long memberId) {
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

    // ======================
    // 🔒 관리자 검증 (2차 방어선)
    // ======================
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

    // ======================
    //  내부 공통 메서드
    // ======================
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
        Long adminId = getCurrentAdminId();

        AdminActionLog log = AdminActionLog.create(
                adminId,
                targetMemberId,
                actionType,
                beforeValue,
                afterValue,
                reason
        );

        adminActionLogRepository.save(log);
    }

    private AdminMemberResponseDTO toAdminMemberResponse(Member member) {
        return new AdminMemberResponseDTO(
                member.getMemberId(),
                member.getEmail(),
                member.getName(),
                member.getStatus(),
                member.getRole(),
                member.getRegdate()
        );
    }
}
