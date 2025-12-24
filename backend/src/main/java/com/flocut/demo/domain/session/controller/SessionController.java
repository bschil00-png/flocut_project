package com.flocut.demo.domain.session.controller;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.domain.session.dto.request.SessionCreateRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionUpdateRequestDTO;
import com.flocut.demo.domain.session.dto.response.SessionDetailResponseDTO;
import com.flocut.demo.domain.session.dto.response.SessionResponseDTO;
import com.flocut.demo.domain.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final MemberService memberService;

    @PostMapping
    public ResponseEntity<Void> createSession(
            @AuthenticationPrincipal String email,
            @RequestBody SessionCreateRequestDTO dto
    ) {
        Member member = memberService.findByEmail(email);
        sessionService.createSession(member.getMemberId(), dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<SessionResponseDTO>> getMySessions(
            @AuthenticationPrincipal String email
    ) {
        Member member = memberService.findByEmail(email);
        return ResponseEntity.ok(
                sessionService.getMySessions(member.getMemberId())
        );
    }
// 세션 단건 조회
    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDetailResponseDTO> getSessionDetail(
            @AuthenticationPrincipal String email,
            @PathVariable Long sessionId
    ) {
        Member member = memberService.findByEmail(email);
        return ResponseEntity.ok(
                sessionService.getSessionDetail(member.getMemberId(), sessionId)
        );
    }
    // 세션 수정
    @PatchMapping("/{sessionId}")
    public ResponseEntity<Void> updateSession(
            @AuthenticationPrincipal String email,
            @PathVariable Long sessionId,
            @RequestBody SessionUpdateRequestDTO dto
    ) {
        Member member = memberService.findByEmail(email);
        sessionService.updateSession(member.getMemberId(), sessionId, dto);
        return ResponseEntity.ok().build();
    }


}

