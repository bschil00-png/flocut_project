package com.flocut.demo.domain.member.dto.ResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MemberProfileResponseDTO {

    private Long memberId;              // PK
    private String email;               // 이메일
    private String name;                // 이름
    private String tel;                 // 전화번호
    private String profileImage;        // 프로필
    private List<ProviderInfoDTO> providerList; // 소셜 연동 목록
}