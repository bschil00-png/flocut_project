package com.flocut.demo.domain.note.dto.response;

import com.flocut.demo.domain.note.en.NoteSourceType;

// 노트 기본 응답( 여기에서는 내용 X , 목록 조회, 생성, 수정시 사용)
public record NoteResponseDTO (
        Long noteId,
        Long sessionId,
        String title,
        NoteSourceType sourceType,
        Long sourceId, //프론트에서 원본 보기 버튼 표시 여부 판단(manual 이면 null),
        String status,
        String regdate,
        String moddate
){

}
