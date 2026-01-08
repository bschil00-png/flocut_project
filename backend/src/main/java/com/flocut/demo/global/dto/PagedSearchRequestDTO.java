package com.flocut.demo.global.dto;

import lombok.Getter;

@Getter
public class PagedSearchRequestDTO {

    private SearchConditionDTO condition;
    private PageRequestDTO page;
}
