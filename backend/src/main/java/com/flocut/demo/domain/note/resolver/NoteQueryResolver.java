package com.flocut.demo.domain.note.resolver;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.mapper.NoteMapper;
import com.flocut.demo.domain.note.service.NoteFacade;
import com.flocut.demo.domain.note.service.NoteServiceImpl;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class NoteQueryResolver {

    private final NoteServiceImpl noteService;
    private final NoteMapper noteMapper;
    private final NoteFacade noteFacade;

    @QueryMapping
    public PageResponseDTO<NoteResponseDTO> notesByStatus(
            @Argument Long sessionId,
            @Argument CommonStatus status,
            @Argument PageRequestDTO page,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return noteFacade.getNotesByStatusWithCache(
                sessionId,
                userDetails.getMember(),
                status,
                page
        );
    }

//    @QueryMapping
//    public List<NoteResponseDTO> notesByStatus(
//            @Argument Long sessionId,
//            @Argument CommonStatus status,
//            @AuthenticationPrincipal CustomUserDetails userDetails
//    ) {
//        return noteFacade.getNotesByStatusWithCache(sessionId, userDetails.getMember(), status);
//    }

    //   노트 상세 조회 (미리보기 용)-> 디비만
    @QueryMapping
    public NoteDetailResponseDTO noteDetail(
            @Argument Long noteId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        // 권한 체크가 포함된 서비스 로직 호출
        Note note = noteService.getNote(noteId, userDetails.getMember());
        return noteMapper.toNoteDetailResponseDTO(note);
    }


}
