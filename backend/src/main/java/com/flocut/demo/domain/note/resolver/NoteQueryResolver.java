package com.flocut.demo.domain.note.resolver;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.service.MemberService;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class NoteQueryResolver {

    private final NoteService noteService;
    private final MemberService memberService;

    @QueryMapping
    public List<Note> notesBySession(
            @Argument Long sessionId,
            Authentication authentication
    ) {
        // 🔥 FileResolver와 동일한 인증 흐름
        Member member = memberService.findByEmail(authentication.getName());

        // 🔥 Service를 통해 조회 (Repository 직접 호출 ❌)
        return noteService.getNotesBySession(
                sessionId,
                member.getMemberId()
        );
    }
}
