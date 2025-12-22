package com.flocut.demo.domain.admin.resolver;

import com.flocut.demo.domain.admin.dto.response.AdminLoginHistoryResponseDTO;
import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
import com.flocut.demo.domain.admin.service.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class AdminMemberResolver {

    private final AdminMemberService adminMemberService;

    @QueryMapping
    public AdminMemberPage adminMembers(
            @Argument int page,
            @Argument int size
    ) {
        Page<AdminMemberResponseDTO> result =
                adminMemberService.getMembers(page, size);

        return new AdminMemberPage(
                result.getContent(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber()
        );
    }

    @QueryMapping
    public List<AdminLoginHistoryResponseDTO> adminLoginHistory(
            @Argument Long memberId
    ) {
        return adminMemberService.getLoginHistory(memberId);
    }
}
