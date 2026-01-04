package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.entity.NoteSourceType;
import com.flocut.demo.domain.note.repository.NoteRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import com.flocut.demo.global.utils.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

  private final NoteRepository noteRepository;
  private final SessionRepository sessionRepository;
  private final MemberRepository memberRepository;

  public Long create(Long memberId, NoteCreateRequestDTO dto) {

    Session session = sessionRepository.findById(dto.getSessionId())
            .orElseThrow();

    Member member = memberRepository.findById(memberId)
            .orElseThrow();

    Note note = new Note();
    note.setSession(session);
    note.setMember(member);
    note.setTitle(dto.getTitle());
    note.setContent(dto.getContent());
    note.setSourceType(NoteSourceType.MANUAL); // 기본값

    noteRepository.save(note);

    return note.getNoteId();
  }

  public List<Note> getNotesBySession(Long sessionId, Long memberId) {
    return noteRepository
            .findBySession_SessionIdAndMember_MemberIdAndStatus(
                    sessionId,
                    memberId,
                    "ACTIVE"
            );
  }

  // 노트 단건 조회
  public Note getNote(Long noteId) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    CustomUserDetails user =
            (CustomUserDetails) authentication.getPrincipal();

    Long memberId = user.getMemberId();

    Note note = noteRepository.findById(noteId)
            .orElseThrow(() ->
                    new IllegalArgumentException("존재하지 않는 노트입니다.")
            );

    // 권한 체크
    if (!note.getMember().getMemberId().equals(memberId)) {
      throw new IllegalStateException("노트 조회 권한이 없습니다.");
    }

    return note;
  }

  //    노트 수정
  public void update(Long noteId, Long memberId, NoteUpdateRequestDTO dto) {

    Note note = noteRepository.findById(noteId)
            .orElseThrow(() ->
                    new IllegalArgumentException("존재하지 않는 노트입니다.")
            );

    // 권한 체크
    if (!note.getMember().getMemberId().equals(memberId)) {
      throw new IllegalStateException("노트 수정 권한이 없습니다.");
    }

    // 제목 수정
    if (dto.getTitle() != null) {
      note.setTitle(dto.getTitle());
    }

    // 본문 수정
    if (dto.getContent() != null) {
      note.setContent(dto.getContent());
    }

    // 상태 수정 (선택)
    if (dto.getStatus() != null) {
      note.setStatus(dto.getStatus());
    }
  }
}
