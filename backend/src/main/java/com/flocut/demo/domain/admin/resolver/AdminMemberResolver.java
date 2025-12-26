package com.flocut.demo.domain.admin.resolver;

import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberPageDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
import com.flocut.demo.domain.admin.service.AdminMemberService;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.entity.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class AdminMemberResolver {

    private final AdminMemberService adminMemberService;

    // 🔒 공통 관리자 권한 체크
    private void checkAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new RuntimeException("관리자 권한 필요");
        }
    }

    //  관리자 회원 목록 조회
    @QueryMapping
    public AdminMemberPageDTO adminMembers(
            @Argument int page,
            @Argument int size
    ) {
        checkAdmin(); // 🔥 핵심

        Page<AdminMemberResponseDTO> result =
                adminMemberService.getMembers(page, size);

        return new AdminMemberPageDTO(
                result.getContent(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber()
        );
    }

    //  관리자 로그인 이력 조회
    @QueryMapping
    public List<AdminLoginHistoryResponseDTO> adminLoginHistory(
            @Argument Long memberId
    ) {
        checkAdmin(); // 🔥 핵심
        return adminMemberService.getLoginHistory(memberId);
    }

    // 상태(status) 변경
    @MutationMapping
    public Boolean adminUpdateMemberStatus(
            @Argument Long memberId,
            @Argument MemberStatus status,
            @Argument String reason
    ) {
        checkAdmin();

        adminMemberService.updateMemberStatus(
                memberId,
                status,
                reason
        );
        return true;
    }
    // 권한(role) 변경
    @MutationMapping
    public Boolean adminUpdateMemberRole(
            @Argument Long memberId,
            @Argument UserRole role,
            @Argument String reason
    ) {
        checkAdmin();

        adminMemberService.updateMemberRole(
                memberId,
                role,
                reason
        );
        return true;
    }

}
