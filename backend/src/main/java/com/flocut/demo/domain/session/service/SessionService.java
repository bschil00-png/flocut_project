package com.flocut.demo.domain.session.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.session.dto.request.SessionCreateRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionUpdateRequestDTO;
import com.flocut.demo.domain.session.dto.response.SessionDetailResponseDTO;
import com.flocut.demo.domain.session.dto.response.SessionResponseDTO;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.entity.SessionStatus;
import com.flocut.demo.domain.session.repository.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionService {

    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;

    public void createSession(Long memberId, SessionCreateRequestDTO dto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        Session session = Session.create(member, dto.getSessionTitle(), dto.getDescription());
        sessionRepository.save(session);
    }

    public List<SessionResponseDTO> getMySessions(Long memberId) {
        return sessionRepository
                .findByMemberMemberIdAndStatusOrderByRegdateDesc(memberId, SessionStatus.ACTIVE)
                .stream()
                .map(s -> new SessionResponseDTO(
                        s.getSessionId(),
                        s.getSessionTitle(),
                        s.getDescription(),
                        s.getStatus(),
                        s.getRegdate()
                ))
                .toList();
    }

    public SessionDetailResponseDTO getSessionDetail(Long memberId, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        if (!session.getMember().getMemberId().equals(memberId)) {
            throw new IllegalStateException("권한 없음");
        }

        return new SessionDetailResponseDTO(
                session.getSessionId(),
                session.getSessionTitle(),
                session.getDescription(),
                session.getStatus(),
                session.getRegdate(),
                session.getModdate()
        );
    }

    @Transactional
    public void updateSession(Long memberId, Long sessionId, SessionUpdateRequestDTO dto) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        if (!session.getMember().getMemberId().equals(memberId)) {
            throw new IllegalStateException("권한 없음");
        }

        if (dto.getSessionTitle() != null) {
            session.changeTitle(dto.getSessionTitle());
        }
        if (dto.getDescription() != null) {
            session.changeDescription(dto.getDescription());
        }
    }



}
