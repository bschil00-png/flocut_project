package com.flocut.demo.global.utils;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

  private final MemberRepository memberRepository;

  public Long getCurrentMemberId() {
    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      throw new IllegalStateException("인증 정보가 없습니다.");
    }

    Object principal = authentication.getPrincipal();

    if (principal instanceof CustomUserDetails userDetails) {
      return userDetails.getMemberId();
    }

    if (principal instanceof String email) {
      return memberRepository.findByEmail(email)
              .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."))
              .getMemberId();
    }

    throw new IllegalStateException(
            "지원하지 않는 인증 타입입니다: " + principal.getClass()
    );
  }
}
