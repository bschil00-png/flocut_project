package com.flocut.demo.domain.session.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SessionCreateRequestDTO {
    private String sessionTitle;
    private String description;
}
