package com.flocut.demo.domain.session.dto.response;

import com.flocut.demo.domain.session.entity.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;


// 나중에 상세목록에 추가할경우를 대비해서 DTO 나눔
@Getter
@AllArgsConstructor
public class SessionDetailResponseDTO {
    private Long sessionId;
    private String sessionTitle;
    private String description;
    private SessionStatus status;
    private LocalDateTime regdate;
    private LocalDateTime moddate;
}
