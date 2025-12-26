package com.flocut.demo.global.dto;

import lombok.Getter;

@Getter
public class SearchRequestDTO {

    private String keyword;   // 검색어
    private int page = 0;
    private int size = 20;
}
