package com.flocut.demo.domain.file.resolver;

import com.flocut.demo.domain.file.dto.response.FileItemResponse;
import com.flocut.demo.domain.file.service.FileService;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class FileResolver {

    private final FileService fileService;
    private final MemberService memberService;

    @QueryMapping
    public List<FileItemResponse> myFiles(Authentication authentication) {
        Member member = memberService.findByEmail(authentication.getName());
        return fileService.getMyFiles(member.getMemberId());
    }
}
