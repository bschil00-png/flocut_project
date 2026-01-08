package com.flocut.demo.domain.note.dto.request;

public record NoteMoveRequestDTO(
        Long sessionId
) {
  public NoteMoveRequestDTO {
    if (sessionId == null) {
      throw new IllegalArgumentException("이동할 세션 ID는 필수입니다.");
    }
  }
}