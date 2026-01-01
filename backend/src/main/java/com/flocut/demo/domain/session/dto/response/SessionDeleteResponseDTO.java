package com.flocut.demo.domain.session.dto.response;

import com.flocut.demo.domain.session.entity.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SessionDeleteResponseDTO {
    private Long sessionId;
    private boolean deleted;
    private SessionStatus status;
}
