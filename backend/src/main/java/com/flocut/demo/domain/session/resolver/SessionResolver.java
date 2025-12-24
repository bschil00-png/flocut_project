package com.flocut.demo.domain.session.resolver;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.domain.session.dto.request.SessionCreateRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionUpdateRequestDTO;
import com.flocut.demo.domain.session.dto.response.SessionDetailResponseDTO;
import com.flocut.demo.domain.session.dto.response.SessionResponseDTO;
import com.flocut.demo.domain.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class SessionResolver {

    private final SessionService sessionService;
    private final MemberService memberService;

    /* =========================
       Query
       ========================= */

    @QueryMapping
    public List<SessionResponseDTO> sessions(Authentication authentication) {
        String email = authentication.getName();
        Member member = memberService.findByEmail(email);
        return sessionService.getMySessions(member.getMemberId());
    }

    @QueryMapping
    public SessionDetailResponseDTO session(
            @Argument Long sessionId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Member member = memberService.findByEmail(email);
        return sessionService.getSessionDetail(
                member.getMemberId(),
                sessionId
        );
    }

    /* =========================
       Mutation
       ========================= */

    @MutationMapping
    public Boolean createSession(
            @Argument String sessionTitle,
            @Argument String description,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Member member = memberService.findByEmail(email);

        SessionCreateRequestDTO dto =
                new SessionCreateRequestDTO(sessionTitle, description);

        sessionService.createSession(member.getMemberId(), dto);
        return true;
    }

    @MutationMapping
    public Boolean updateSession(
            @Argument Long sessionId,
            @Argument String sessionTitle,
            @Argument String description,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Member member = memberService.findByEmail(email);

        SessionUpdateRequestDTO dto =
                new SessionUpdateRequestDTO(sessionTitle, description);

        sessionService.updateSession(
                member.getMemberId(),
                sessionId,
                dto
        );
        return true;
    }
}
