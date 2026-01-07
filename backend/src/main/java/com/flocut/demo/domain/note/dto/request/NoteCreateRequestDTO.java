package com.flocut.demo.domain.note.dto.request;

import com.flocut.demo.domain.note.en.NoteSourceType;
import lombok.Getter;

@Getter
public class NoteCreateRequestDTO {
    private Long sessionId;
    private String title;
    private String content;
    private NoteSourceType sourceType;
    private Long sourceId;
}

