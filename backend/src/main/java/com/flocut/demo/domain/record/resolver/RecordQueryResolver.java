package com.flocut.demo.domain.record.resolver;

import com.flocut.demo.domain.record.dto.response.RecordResponse;
import com.flocut.demo.domain.record.service.RecordService;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class RecordQueryResolver {

    private final RecordService recordService;

    @QueryMapping
    public PageResponseDTO<RecordResponse> recordsBySession(
            @Argument Long sessionId,
            @Argument PageRequestDTO page,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return recordService.getBySession(sessionId,user.getMember().getMemberId(),page);
    }
}


