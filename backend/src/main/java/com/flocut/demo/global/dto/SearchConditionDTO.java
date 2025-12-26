package com.flocut.demo.global.dto;

import lombok.Getter;

@Getter
public class SearchConditionDTO {

    private String keyword;
    private String status;
    private String type;      // DOCUMENT / AUDIO
    private int page;
    private int size;
}
