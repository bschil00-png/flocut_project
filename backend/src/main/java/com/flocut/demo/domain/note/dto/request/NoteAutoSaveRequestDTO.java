package com.flocut.demo.domain.note.dto.request;

public record NoteAutoSaveRequestDTO(
        String title,
        String content
) {
//    제목이나 내용 둘중 하나 null 이더라도 허용
    public NoteAutoSaveRequestDTO {
        if (title == null && content == null)
            throw new IllegalArgumentException("저장할 내용이 없습니다");
    }
}
