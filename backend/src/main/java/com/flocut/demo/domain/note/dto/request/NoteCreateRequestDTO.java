package com.flocut.demo.domain.note.dto.request;

import com.flocut.demo.domain.note.entity.NoteSourceType;
import lombok.Getter;

@Getter
public class NoteCreateRequestDTO {
    private Long sessionId;
    private Long memberId;
    private String title;
    private String content;
    private NoteSourceType sourceType;
    private Long sourceId;
}

