package com.flocut.demo.domain.note.controller;

import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.service.NoteService;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
