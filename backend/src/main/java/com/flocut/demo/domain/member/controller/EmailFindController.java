package com.flocut.demo.domain.member.controller;


import com.flocut.demo.domain.member.dto.RequestDTO.FindEmailRequestDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.ErrorResponseDTO;
import com.flocut.demo.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class EmailFindController {

    private final MemberService memberService;

    @PostMapping("/find-email")
    public ResponseEntity<?> findEmail(
            @RequestBody FindEmailRequestDTO dto
    ) {
        memberService.processFindEmail(dto.getTel());

        // 🔥 항상 동일한 응답
        return ResponseEntity.ok(
                Map.of("message", "등록된 정보가 있다면 이메일로 안내를 전송했습니다.")
        );
    }

}
