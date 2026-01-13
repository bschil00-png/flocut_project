package com.flocut.demo.domain.session.controller;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.domain.session.dto.request.SessionCreateRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionDeleteRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionUpdateRequestDTO;
import com.flocut.demo.domain.session.dto.response.SessionDeleteResponseDTO;
import com.flocut.demo.domain.session.dto.response.SessionResponseDTO;
import com.flocut.demo.domain.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final MemberService memberService;


    @PostMapping
    public ResponseEntity<SessionResponseDTO> createSession(
            @RequestBody SessionCreateRequestDTO request,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return ResponseEntity.ok(
                sessionService.createSession(member.getMemberId(), request)
        );
    }


    @PatchMapping("/{sessionId}")
    public ResponseEntity<SessionResponseDTO> updateSession(
            @PathVariable Long sessionId,
            @RequestBody SessionUpdateRequestDTO request,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return ResponseEntity.ok(
                sessionService.updateSession(
                        member.getMemberId(),
                        sessionId,
                        request
                )
        );
    }


    @DeleteMapping("/{sessionId}")
    public ResponseEntity<SessionDeleteResponseDTO> deleteSession(
            @PathVariable Long sessionId,
            Authentication authentication
    ) {
        Member member = memberService.findByEmail(authentication.getName());

        return ResponseEntity.ok(
                sessionService.deleteSession(
                        member.getMemberId(),
                        new SessionDeleteRequestDTO(sessionId)
                )
        );
    }
}
