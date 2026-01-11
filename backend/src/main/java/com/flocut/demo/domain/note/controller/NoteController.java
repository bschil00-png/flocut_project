package com.flocut.demo.domain.note.controller;

import com.flocut.demo.domain.note.dto.request.NoteCreateFromSummaryRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteMoveRequestDTO;
import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.service.NoteFacade;
import com.flocut.demo.domain.note.service.NoteService;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notes")
public class NoteController {
  private final NoteFacade noteFacade;
  private final NoteService noteService;

  // 노트 생성
  @PostMapping
  public ResponseEntity<Long> createNote(
          @AuthenticationPrincipal CustomUserDetails userDetails,
          @RequestBody NoteCreateRequestDTO dto) {
    return ResponseEntity.ok(noteService.createNote(userDetails.getMember(), dto));
  }

  //요약 내용 노트에 저장
  @PostMapping("/from-summary")
  public ResponseEntity<Long> createNoteFromSummary(
          @AuthenticationPrincipal CustomUserDetails userDetails,
          @RequestBody NoteCreateFromSummaryRequestDTO dto) {

    return ResponseEntity.ok(noteService.createNoteFromSummary(
                    userDetails.getMember(),
                    dto
            )
    );
  }

  //        노트 요약 요청
  @PostMapping("/{noteId}/summary")
  public ResponseEntity<Long> requestNoteSummary(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails
  ) {
    Long summaryId =
            noteService.requestNoteSummary(
                    noteId,
                    userDetails.getMember()
            );

    return ResponseEntity.ok(summaryId);
  }

  //    실시간 자동 저장 (레디스 캐시) - 프론트엔드에서 사용자가 타이핑 할 떄마다 호출되는 API 용도
  @PatchMapping("/{noteId}/autosave")
  public ResponseEntity<Void> autoSaveNote(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails,
          @RequestBody Map<String, String> body) {
    noteFacade.autoSave(
            noteId,
            userDetails.getMember(),
            body.get("title"),
            body.get("content")
    );
    return ResponseEntity.ok().build();
  }

  //    수동 저장 (레디스 삭제 및 디비 동기화)
  @PostMapping("/{noteId}/sync")
  public ResponseEntity<Void> syncNote(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails) {
//        페서드 내부에서 디비 업데이트 후 레디스 캐시 삭제
    noteFacade.sync(noteId, userDetails.getMember());
    return ResponseEntity.ok().build();
  }

  //    음성 파일 저장
  @PatchMapping("/{noteId}/append-records")
  public ResponseEntity<Void> finishVoiceRecording(
          @PathVariable Long noteId,
          @RequestParam Long sessionId,
          @AuthenticationPrincipal CustomUserDetails user) {

    // 조각들을 하나로 합쳐서 노트 본문에 확정 반영
    noteFacade.appendRecordsToNote(noteId, sessionId, user.getMember());

    return ResponseEntity.ok().build();
  }


  //     노트 복구 (deleted  상태 노트를 다시 active 로 - 30일 이내)
  @PatchMapping("/{noteId}/restore")
  public ResponseEntity<Void> restore(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails) {
    noteService.restoreNote(noteId, userDetails.getMember());
    return ResponseEntity.ok().build();
  }

  // 영구 삭제
  @DeleteMapping("/{noteId}/hard")
  public ResponseEntity<Void> permanentDelete(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails) {
    //  DB에서 완전 삭제
    noteService.hardDeleteNote(noteId, userDetails.getMember());
    // Redis에 남아있을지 모를 캐시 파기
    noteFacade.clearCache(noteId);
    return ResponseEntity.ok().build();
  }

  //    레디스 병합 노트 조회
  @GetMapping("/{noteId}")
  public ResponseEntity<NoteDetailResponseDTO> getNoteDetail(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails) {

    // Redis + DB 병합 조회
    NoteDetailResponseDTO note = noteFacade.getNoteWithCache(
            noteId,
            userDetails.getMember()
    );
    return ResponseEntity.ok(note);
  }

  //노트 이동(세션 이동)
  @PatchMapping("/{noteId}/move")
  public ResponseEntity<Void> moveNote(
          @PathVariable Long noteId,
          @RequestBody NoteMoveRequestDTO dto,
          @AuthenticationPrincipal CustomUserDetails userDetails
  ) {
    // Facade를 통해 Redis 캐시 동기화 후 DB 이동 처리
    noteFacade.moveNoteWithCache(noteId, dto.sessionId(), userDetails.getMember());

    return ResponseEntity.ok().build();
  }

  //  휴지통 이동
  @PatchMapping("/{noteId}/trash")
  public ResponseEntity<Void> moveNoteToTrash(
          @PathVariable Long noteId,
          @AuthenticationPrincipal CustomUserDetails userDetails
  ) {
    // 캐시 정리 (수정 중인 내용이 있다면 날리거나 sync)
    noteFacade.clearCache(noteId);

    //  서비스에서 status = DELETED, deletedAt = now() 처리
    noteService.deleteNote(noteId, userDetails.getMember());

    return ResponseEntity.ok().build();
  }

}
