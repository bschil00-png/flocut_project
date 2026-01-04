package com.flocut.demo.domain.note.controller;

import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.dto.request.NoteUpdateRequestDTO;
import com.flocut.demo.domain.note.service.NoteService;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<Long> createNote(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody NoteCreateRequestDTO dto
    ) {
        Long noteId = noteService.create(
                user.getMemberId(),
                dto
        );
        return ResponseEntity.ok(noteId);
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<Void> updateNote(
            @PathVariable Long noteId,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody NoteUpdateRequestDTO dto
    ) {
        noteService.update(
                noteId,
                user.getMemberId(),
                dto
        );
        return ResponseEntity.ok().build();
    }

}
