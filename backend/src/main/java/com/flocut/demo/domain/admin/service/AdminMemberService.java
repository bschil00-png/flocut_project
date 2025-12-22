package com.flocut.demo.domain.admin.service;

import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminMemberService {

    private final MemberRepository memberRepository;
    private final AdminActionLogRepository adminActionLogRepository;

    // 1️⃣ 회원 목록 조회
    public Page<AdminMemberResponseDTO> getMembers(int page, int size) {
        return memberRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        ).map(member ->
                new AdminMemberResponseDTO(
                        member.getMemberId(),
                        member.getEmail(),
                        member.getName(),
                        member.getRole(),
                        member.getStatus(),
                        member.getCreatedAt()
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

    // 4️⃣ 2FA 초기화
    @Transactional
    public void resetTwoFactor(Long memberId, String reason) {
        Member member = getMember(memberId);

        member.disableTwoFactor(); // 🔥 Member 엔티티에 메서드 두는 걸 권장

        saveAdminLog(memberId, "TWO_FACTOR_RESET", "ENABLED", "DISABLED", reason);
    }

    // 5️⃣ 로그인 이력 조회 (예시)
    public List<AdminLoginHistoryResponseDTO> getLoginHistory(Long memberId) {
        // 로그인 이력 테이블 생긴 뒤 구현
        return List.of();
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
        AdminActionLog log = AdminActionLog.create(
                targetMemberId,
                actionType,
                beforeValue,
                afterValue,
                reason
        );
        adminActionLogRepository.save(log);
    }
}
