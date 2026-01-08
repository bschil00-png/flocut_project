package com.flocut.demo.domain.note.dto.request;

//노트 수정 요청 DTO

public record NoteUpdateRequestDTO(
        String title,
        String content
) {
    //     title 과 content가 둘다 null 이면 수정할 내용이 없음
//     하나라도 null 이 아니면 통과
    public NoteUpdateRequestDTO {
        if (title == null && content == null) {
            throw new IllegalArgumentException("수정할 내용이 없습니다.");
        }
    }

    //     제목 변경 여부 확인
    public boolean hasTitle() {
        return title != null;
    }

    //        내용 변경 여부 확인
    public boolean hasContent() {
        return content != null;
    }

}