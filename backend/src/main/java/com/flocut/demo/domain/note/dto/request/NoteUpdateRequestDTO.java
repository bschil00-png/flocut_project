package com.flocut.demo.domain.note.dto.request;

import com.flocut.demo.domain.note.entity.NoteSourceType;
import lombok.Getter;

//노트 수정 요청 DTO

@Getter
public class NoteUpdateRequestDTO {

// 제목
  private String title;
//   내용
  private String content;
//  노트 상태
  private String status;

}
