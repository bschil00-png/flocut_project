package com.flocut.demo.domain.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AdminMemberPageDTO {

    private List<AdminMemberResponseDTO> content;
    private long totalElements;
    private int totalPages;
    private int pageNumber;
}
