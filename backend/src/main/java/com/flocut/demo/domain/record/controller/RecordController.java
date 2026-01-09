package com.flocut.demo.domain.record.controller;

import com.flocut.demo.domain.record.dto.request.RecordBulkDeleteRequest;
import com.flocut.demo.domain.record.dto.request.RecordCreateRequest;
import com.flocut.demo.domain.record.dto.request.RecordUpdateRequest;
import com.flocut.demo.domain.record.dto.response.DeleteResultResponse;
import com.flocut.demo.domain.record.service.RecordService;
import com.flocut.demo.global.utils.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    public ResponseEntity<Long> save(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody RecordCreateRequest request
    ) {
        return ResponseEntity.ok(
                recordService.save(
                        user.getMember().getMemberId(),
                        request
                )
        );
    }

    // update

    @PutMapping("/{recordId}")
    public ResponseEntity<Void> update(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long recordId,
            @RequestBody RecordUpdateRequest request
    ) {
        recordService.update(
                recordId,
                user.getMember().getMemberId(),
                request.getContent()
        );
        return ResponseEntity.noContent().build();
    }





    //  hard delet

    @DeleteMapping
    public ResponseEntity<DeleteResultResponse> bulkDelete(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody RecordBulkDeleteRequest request
    ) {
        int deletedCount =
                recordService.bulkDelete(
                        user.getMember().getMemberId(),
                        request.getRecordIds()
                );

        return ResponseEntity.ok(
                new DeleteResultResponse(deletedCount)
        );
    }

//    @DeleteMapping("/{recordId}")
//    public ResponseEntity<Void> delete(
//            @AuthenticationPrincipal CustomUserDetails user,
//            @PathVariable Long recordId
//    ) {
//        recordService.delete(
//                recordId,
//                user.getMember().getMemberId()
//        );
//        return ResponseEntity.noContent().build();
//    }


}
