package com.flocut.demo.domain.session.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.session.dto.request.SessionCreateRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionDeleteRequestDTO;
import com.flocut.demo.domain.session.dto.request.SessionUpdateRequestDTO;
import com.flocut.demo.domain.session.dto.response.SessionDeleteResponseDTO;
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

    /**
     * 세션 생성 (패턴 C)
     */
    public SessionResponseDTO createSession(Long memberId, SessionCreateRequestDTO dto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 없음"));

        Session session = Session.create(
                member,
                dto.getSessionTitle(),
                dto.getDescription()
        );

        sessionRepository.save(session);

        return toSessionResponse(session);
    }

    /**
     * 내 세션 목록 조회
     */
    public List<SessionResponseDTO> getMySessions(Long memberId) {
        return sessionRepository
                .findByMemberMemberIdAndStatusOrderByRegdateDesc(
                        memberId,
                        SessionStatus.ACTIVE
                )
                .stream()
                .map(this::toSessionResponse)
                .toList();
    }

    /**
     * 세션 상세 조회
     */
    public SessionDetailResponseDTO getSessionDetail(Long memberId, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        validateOwner(session, memberId);

        if (session.getStatus() == SessionStatus.DELETED) {
            throw new IllegalStateException("삭제된 세션입니다");
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

    /**
     * 세션 수정 (패턴 C)
     */
    public SessionResponseDTO updateSession(
            Long memberId,
            Long sessionId,
            SessionUpdateRequestDTO dto
    ) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        validateOwner(session, memberId);

        session.changeTitle(dto.getSessionTitle());
        session.changeDescription(dto.getDescription());

        sessionRepository.flush();

        return toSessionResponse(session);
    }

    @Transactional
    public SessionDeleteResponseDTO deleteSession(
            Long memberId,
            SessionDeleteRequestDTO dto
    ) {
        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        validateOwner(session, memberId);

        session.delete(); // Soft delete (status = DELETED)

        return new SessionDeleteResponseDTO(
                session.getSessionId(),
                true,
                session.getStatus()
        );
    }


    /* =========================
       내부 공통 메서드
       ========================= */

    private void validateOwner(Session session, Long memberId) {
        if (!session.getMember().getMemberId().equals(memberId)) {
            throw new IllegalStateException("권한 없음");
        }
    }

    private SessionResponseDTO toSessionResponse(Session session) {
        return new SessionResponseDTO(
                session.getSessionId(),
                session.getSessionTitle(),
                session.getDescription(),
                session.getStatus(),
                session.getRegdate(),
                session.getModdate()
        );
    }
}
