package com.flocut.demo.domain.member.controller;


import com.flocut.demo.domain.member.dto.RequestDTO.FindEmailRequestDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.ErrorResponseDTO;
import com.flocut.demo.domain.member.dto.ResponseDTO.FindEmailResponseDTO;
import com.flocut.demo.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class EmailFindController {

    private final MemberService memberService;
    @PostMapping("/find-email")
    public ResponseEntity<FindEmailResponseDTO> findEmail(
            @RequestBody FindEmailRequestDTO dto
    ) {
        List<String> maskedEmails =
                memberService.findEmailAndSendMailIfExists(dto.getTel());

        return ResponseEntity.ok(new FindEmailResponseDTO(maskedEmails));
    }

}
