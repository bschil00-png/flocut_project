package com.flocut.demo.domain.record.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranscribeResponse {
  private Long recordId;
  private String transcript;
}