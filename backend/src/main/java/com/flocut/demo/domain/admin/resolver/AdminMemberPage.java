package com.flocut.demo.domain.admin.resolver;

import com.flocut.demo.domain.admin.dto.response.AdminMemberResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AdminMemberPage {

    private List<AdminMemberResponseDTO> content;
    private long totalElements;
    private int totalPages;
    private int pageNumber;
}
