package com.flocut.demo.domain.note.controller;

import com.flocut.demo.domain.note.dto.request.NoteCreateRequestDTO;
import com.flocut.demo.domain.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestBody NoteCreateRequestDTO dto
    ) {
        Long noteId = noteService.create(dto);
        return ResponseEntity.ok(noteId);
    }
}
