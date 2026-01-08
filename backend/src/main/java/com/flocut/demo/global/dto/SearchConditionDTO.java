package com.flocut.demo.global.dto;

import lombok.Getter;

@Getter
public class SearchConditionDTO {

    private String keyword;   // 검색어
    private String status;    // 상태 필터
    private String type;      // DOCUMENT / AUDIO 등
}
