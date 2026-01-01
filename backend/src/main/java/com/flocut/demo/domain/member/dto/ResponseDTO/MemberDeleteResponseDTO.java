package com.flocut.demo.domain.member.dto.ResponseDTO;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberDeleteResponseDTO {

    private boolean deleted; // 성공 여부
    private String message;  // 안내 메시지
}