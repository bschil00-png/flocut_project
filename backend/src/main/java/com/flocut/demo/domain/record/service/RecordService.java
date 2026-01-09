package com.flocut.demo.domain.record.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.record.dto.request.RecordCreateRequest;
import com.flocut.demo.domain.record.dto.response.RecordResponse;
import com.flocut.demo.domain.record.entity.Record;
import com.flocut.demo.domain.record.repository.RecordRepository;
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RecordService {

    private final RecordRepository recordRepository;
    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;

    // 저장
    public Long save(Long memberId, RecordCreateRequest request) {

        Session session =
                sessionRepository.findById(request.getSessionId())
                        .orElseThrow(() ->
                                new IllegalArgumentException("세션 없음")
                        );

        Member member =
                memberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("회원 없음")
                        );

        Record record =
                new Record(
                        session,
                        member,
                        request.getContent()
                );

        return recordRepository.save(record).getRecordId();
    }

    // GraphQL 조회 (페이지네이션)
    @Transactional(readOnly = true)
    public PageResponseDTO<RecordResponse> getBySession(
            Long sessionId,
            Long memberId,
            PageRequestDTO page
    ) {
        Pageable pageable =
                PageRequest.of(page.getPage(), page.getSize());

        Page<Record> result =
                recordRepository
                        .findBySessionSessionIdAndSessionMemberMemberIdOrderByCreatedAtDesc(
                                sessionId,
                                memberId,
                                pageable
                        );

        List<RecordResponse> content =
                result.getContent().stream()
                        .map(r -> new RecordResponse(
                                r.getRecordId(),
                                r.getContent(),
                                r.getCreatedAt()
                        ))
                        .toList();

        return new PageResponseDTO<>(
                content,
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber(),
                result.getSize(),
                result.hasNext(),
                result.hasPrevious(),
                result.isFirst(),
                result.isLast()
        );
    }

    // update
    @Transactional
    public void update(
            Long recordId,
            Long memberId,
            String content
    ) {
        Record record =
                recordRepository
                        .findByRecordIdAndMemberMemberId(
                                recordId,
                                memberId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException("수정 권한 없음")
                        );

        record.updateContent(content);
    }

    // 삭제

    @Transactional
    public int bulkDelete(
            Long memberId,
            List<Long> recordIds
    ) {
        if (recordIds == null || recordIds.isEmpty()) {
            throw new IllegalArgumentException("삭제할 항목이 없습니다");
        }

        return recordRepository.deleteByRecordIdInAndMemberMemberId(
                recordIds,
                memberId
        );
    }
//    public void delete(Long recordId, Long memberId) {
//        recordRepository.deleteByRecordIdAndMemberMemberId(
//                recordId,
//                memberId
//        );
//    }
}
