package com.flocut.demo.domain.note.dto.response;

import com.flocut.demo.domain.note.en.NoteSourceType;

// 노트 상세 조회
// 노트 편집 페이지 집입시
public record NoteDetailResponseDTO(
        Long noteId,
        Long sessionId,
        String title,
        String content,
        NoteSourceType sourceType,
        Long sourceId, //프론트에서 원본 보기 버튼 표시 여부 판단(manual 이면 null),
        String status,
        String regdate,
        String moddate
){
    
}
