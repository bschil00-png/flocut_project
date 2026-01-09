package com.flocut.demo.domain.session.resolver;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;

import com.flocut.demo.domain.session.dto.response.SessionDetailResponseDTO;
import com.flocut.demo.domain.session.dto.response.SessionResponseDTO;
import com.flocut.demo.domain.session.service.SessionService;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class SessionResolver {

    private final SessionService sessionService;
    private final MemberService memberService;

    // 세션 목록 조회 (페이지네이션, Workspace 전용)
    @QueryMapping
    public PageResponseDTO<SessionResponseDTO> sessions(
            @Argument PageRequestDTO page,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return sessionService.getMySessions(
                member.getMemberId(),
                page
        );
    }

    // 세션 목록 조회 (네비용, 페이지네이션 없음)
    @QueryMapping
    public List<SessionResponseDTO> mySessions(
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return sessionService.getMySessions(
                member.getMemberId()
        );
    }

//    세션 상세 조회

    @QueryMapping
    public SessionDetailResponseDTO session(
            @Argument Long sessionId,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return sessionService.getSessionDetail(
                member.getMemberId(),
                sessionId
        );
    }
}
