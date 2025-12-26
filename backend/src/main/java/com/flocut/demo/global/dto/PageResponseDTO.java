package com.flocut.demo.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PageResponseDTO<T> {

    private List<T> content;      // 실제 데이터
    private long totalElements;   // 전체 개수
    private int totalPages;       // 전체 페이지 수
    private int pageNumber;       // 현재 페이지 (0부터)
    private int pageSize;         // 페이지 크기
    private boolean hasNext;      // 다음 페이지 존재 여부
}
