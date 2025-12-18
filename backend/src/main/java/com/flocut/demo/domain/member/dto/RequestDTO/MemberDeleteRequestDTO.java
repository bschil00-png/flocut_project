package com.flocut.demo.domain.member.dto.RequestDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class MemberDeleteRequestDTO {

    @NotNull
    private Long memberId;

    // 선택값
    private String reason;
}