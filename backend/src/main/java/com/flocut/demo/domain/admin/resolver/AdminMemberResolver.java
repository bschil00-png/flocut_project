package com.flocut.demo.domain.admin.resolver;

import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberDetailResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
import com.flocut.demo.domain.admin.service.AdminMemberService;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class AdminMemberResolver {

    private final AdminMemberService adminMemberService;

    // 관리자 체크
    private void checkAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new RuntimeException("관리자 권한 필요");
        }
    }

    // 관리자 회원 목록 조회
    @QueryMapping
    public PageResponseDTO<AdminMemberResponseDTO> adminMembers(
            @Argument int page,
            @Argument int size
    ) {
        checkAdmin(); // 🔥 유지 (중요)

        return adminMemberService.getMembers(page, size);
    }

    // 관리자 회원 상세 조회
    @QueryMapping
    public AdminMemberDetailResponseDTO adminMember(
            @Argument Long memberId
    ) {
        checkAdmin(); // 🔥 1차 방어
        return adminMemberService.getMemberDetail(memberId);
    }

    // 관리자 로그인 이력 조회
    @QueryMapping
    public List<AdminLoginHistoryResponseDTO> adminLoginHistory(
            @Argument Long memberId
    ) {
        checkAdmin(); // 🔥 유지
        return adminMemberService.getLoginHistory(memberId);
    }
}
