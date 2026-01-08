package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.note.dto.request.NoteCreateFromSummaryRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;

import java.util.List;

public interface NoteService {
  //    노트 생성
  Long createNote(Member member, NoteCreateRequestDTO dto);

    // 요약 내용 노트에 저장
    Long createNoteFromSummary(Member member, NoteCreateFromSummaryRequestDTO dto);

  //    목록 조회
  PageResponseDTO<Note> getNotesByStatus(
          Long sessionId,
          Member member,
          CommonStatus status,
          PageRequestDTO pageRequest
  );
//  List<Note> getNotesByStatus(Long sessionId, Member member, CommonStatus status);

  //    노트 단건 조회
  Note getNote(Long noteId, Member member);

  //    수정 : 변경 감지
  void updateNote(Long noteId, Member member, NoteUpdateRequestDTO dto);

  //    삭제 (소프트 딜리트)
  void deleteNote(Long noteId, Member member);

  // 복구 로직 (30일 이전엔 가능)
  void restoreNote(Long noteId, Member member);

  //    영구 삭제 (휴지통에서 )
  void hardDeleteNote(Long noteId, Member member);

  // 시스템 자동 동기화용 (권한 체크 제외)
  void updateNoteSystem(Long noteId, NoteUpdateRequestDTO dto);

  //    노트 이동
  void moveNote(Long noteId, Long targetSessionId, Member member);
}
