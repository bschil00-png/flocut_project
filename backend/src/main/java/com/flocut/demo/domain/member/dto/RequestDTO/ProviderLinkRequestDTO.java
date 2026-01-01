package com.flocut.demo.domain.member.dto.RequestDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ProviderLinkRequestDTO {

    @NotBlank
    private String provider;     // GOOGLE / KAKAO / NAVER

    @NotBlank
    private String providerUid;  // 소셜 플랫폼 식별자
}