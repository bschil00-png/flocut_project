package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.repository.NoteRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;

    public Long create(NoteCreateRequestDTO dto) {

        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow();

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow();

        Note note = new Note();
        note.setSession(session);
        note.setMember(member);
        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());
        note.setSourceType(dto.getSourceType());
        note.setSourceId(dto.getSourceId());

        return noteRepository.save(note).getNoteId();
    }

    public List<Note> getNotesBySession(Long sessionId, Long memberId) {
        return noteRepository.findBySession_SessionIdAndMember_MemberIdAndStatus(
                sessionId,
                memberId,
                "ACTIVE"
        );
    }
}
