package com.flocut.demo.domain.session.dto.response;

import com.flocut.demo.domain.session.entity.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SessionResponseDTO {
    private Long sessionId;
    private String sessionTitle;
    private String description;
    private SessionStatus status;
    private LocalDateTime regdate;
    private LocalDateTime moddate;
}