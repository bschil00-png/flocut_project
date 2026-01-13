package com.flocut.demo.domain.member.resolver;

import com.flocut.demo.domain.member.dto.MemberDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.MemberProfileResponseDTO;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import com.flocut.demo.domain.member.mapper.MemberMapper;
import com.flocut.demo.domain.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MemberResolver {

    private final MemberService memberService;
    private final MemberMapper memberMapper;


    // 회원 조회
    @QueryMapping
    public MemberDTO member(@Argument Long id) {
        Member member = memberService.getMember(id);
        return memberMapper.toDto(member);
    }

    //  마이페이지 조회
    @QueryMapping
    public MemberProfileResponseDTO me() {
        return memberService.getMyProfile();

    }
}
