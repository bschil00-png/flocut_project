package com.flocut.demo.domain.note.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteCreateFromSummaryRequestDTO {
    private Long summaryId;
    private Long sessionId;
    private String title; // 노트 제목 (사용자 지정 or 자동)
}