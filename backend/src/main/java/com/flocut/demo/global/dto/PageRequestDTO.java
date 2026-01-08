package com.flocut.demo.global.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageRequestDTO {

    private int page = 0;      // 0-based
    private int size = 20;     // 기본 페이지 크기
}
