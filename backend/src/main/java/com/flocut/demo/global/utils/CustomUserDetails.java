package com.flocut.demo.global.utils;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.UserRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

  private final Member member;

  public CustomUserDetails(Member member) {
    this.member = member;
  }

  public Long getMemberId() {
    return member.getMemberId();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(
            new SimpleGrantedAuthority("ROLE_" + member.getRole().name())
    );
  }

  @Override
  public String getPassword() {
    return member.getPassword();
  }

  @Override
  public String getUsername() {
    return member.getEmail();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return member.getStatus() != null;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return member.getStatus() != null;
  }
}
