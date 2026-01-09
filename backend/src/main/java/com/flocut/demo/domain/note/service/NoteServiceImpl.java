package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.note.dto.request.NoteCreateFromSummaryRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.en.NoteSourceType;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.mapper.NoteMapper;
import com.flocut.demo.domain.note.repository.NoteRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteServiceImpl implements NoteService {

  private final NoteRepository noteRepository;
  private final SessionRepository sessionRepository;
  private final DocumentSummaryRepository documentSummaryRepository;

  // 노트 생성
  @Override
  public Long createNote(Member member, NoteCreateRequestDTO dto) {
    Session session = sessionRepository.findById(dto.getSessionId())
            .orElseThrow(() -> new IllegalArgumentException("세션을 찾을 수 없습니다."));

    NoteSourceType sourceType = (dto.getSourceType() != null)
            ? dto.getSourceType()
            : NoteSourceType.MANUAL;

    Note note = Note.builder()
            .session(session)
            .member(member)
            .title(dto.getTitle())
            .content(dto.getContent())
            .sourceType(sourceType)
            .sourceId(dto.getSourceId())
            .status(CommonStatus.ACTIVE) // 생성 시에 액티브로
            .build();

    return noteRepository.save(note).getNoteId();
  }

    // 요약본에서 노트를 생성하는 로직
    @Override
    public Long createNoteFromSummary(Member member, NoteCreateFromSummaryRequestDTO dto) {
        DocumentSummary summary = documentSummaryRepository.findById(dto.getSummaryId())
                .orElseThrow(() -> new IllegalArgumentException("요약 데이터를 찾을 수 없습니다."));

        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("세션을 찾을 수 없습니다."));

        Note note = Note.builder()
                .member(member)
                .session(session)
                .summary(summary)
                .title(dto.getTitle() != null ? dto.getTitle() : "요약 노트 v" + summary.getVersionNo())
                // 요약 텍스트를 노트 본문(content) 혹은 summaryOption에 초기화
                .content(summary.getSummaryOption())
                .sourceType(NoteSourceType.DOCUMENT)
                .status(CommonStatus.ACTIVE)
                .build();

        return noteRepository.save(note).getNoteId();
    }

    // 페이지네이션이 적용된 목록 조회
    @Override
    public PageResponseDTO<Note> getNotesByStatus(Long sessionId, Member member, CommonStatus status, PageRequestDTO pageRequest) {
        Page<Note> page = noteRepository.findBySession_SessionIdAndMember_MemberIdAndStatus(
                sessionId, member.getMemberId(), status,
                PageRequest.of(pageRequest.getPage(), pageRequest.getSize(), Sort.by(Sort.Direction.DESC, "regdate"))
        );

        // 엔티티 페이지 객체를 공통 응답 DTO로 변환하여 반환
        return new PageResponseDTO<>(page.getContent(), page.getTotalElements(), page.getTotalPages(),
                page.getNumber(), page.getSize(), page.hasNext(), page.hasPrevious(),
                page.isFirst(), page.isLast());
    }
// 노트 접근 권한
    @Override
    public Note getNote(Long noteId, Member member) {
        return noteRepository.findByNoteIdAndMember_MemberId(noteId, member.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("노트 권한이 없습니다."));
    }

  //    노트 업데이트
  @Override
  public void updateNote(Long noteId, Member member, NoteUpdateRequestDTO dto) {
    Note note = getNote(noteId, member);
    if (dto.title() != null) note.setTitle(dto.title());
    if (dto.content() != null) note.setContent(dto.content());
  }

  //    시스템용 노트 업데이트 (스케줄러에서 사용)
  @Override
  @Transactional
  public void updateNoteSystem(Long noteId, NoteUpdateRequestDTO dto) {
    Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 노트입니다."));

    if (dto.title() != null) note.setTitle(dto.title());
    if (dto.content() != null) note.setContent(dto.content());
  }

  @Override
  public void deleteNote(Long noteId, Member member) {
    Note note = getNote(noteId, member);

    note.setStatus(CommonStatus.DELETED);
    note.setDeletedAt(LocalDateTime.now());
//    이후 30일 경과시에 실제로 지우기

  }

  //    영구 삭제
  @Override
  @Transactional
  public void hardDeleteNote(Long noteId, Member member) {
    Note note = getNote(noteId, member);

    // 권한 확인은 getNoteEntity에서 이미 되었으므로 바로 삭제
    noteRepository.delete(note);
  }

  //     복구 로직
  @Override
  @Transactional
  public void restoreNote(Long noteId, Member member) {
    Note note = getNote(noteId, member);

    if (note.getStatus() != CommonStatus.DELETED) {
      throw new IllegalStateException("삭제된 상태의 노트만 복구할 수 있습니다.");
    }

    note.setStatus(CommonStatus.ACTIVE);
    note.setDeletedAt(null); // 삭제 시간 초기화
  }

  //    노트 이동
  @Override
  @Transactional
  public void moveNote(Long noteId, Long targetSessionId, Member member) {
    // 권한 확인이 포함된 조회
    Note note = getNote(noteId, member);

    Session targetSession = sessionRepository.findById(targetSessionId)
            .orElseThrow(() -> new IllegalArgumentException("대상 세션을 찾을 수 없습니다."));

    note.setSession(targetSession);
    // @Transactional에 의해 메서드 종료 시 Update 쿼리 실행
  }
}
