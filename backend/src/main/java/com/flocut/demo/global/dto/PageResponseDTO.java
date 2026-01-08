package com.flocut.demo.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PageResponseDTO<T> {

    private List<T> content;      // 실제 데이터

    private long totalElements;   // 전체 데이터 수
    private int totalPages;       // 전체 페이지 수

    private int pageNumber;       // 현재 페이지 (0-based)
    private int pageSize;         // 페이지 크기

    private boolean hasNext;
    private boolean hasPrevious;

    private boolean isFirst;
    private boolean isLast;
}
