package com.flocut.demo.domain.note.mapper;

import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.util.List;

//, unmappedTargetPolicy = ReportingPolicy.IGNORE
@Mapper(componentModel = "spring")
public interface NoteMapper {

    // 목록 조회용
    @Mapping(source = "session.sessionId", target = "sessionId")
    @Mapping(source = "sourceType", target = "sourceType", qualifiedByName = "enumToString")
    @Mapping(source = "status", target = "status", qualifiedByName = "enumToString")
    @Mapping(source = "regdate", target = "regdate", qualifiedByName = "dateToString")
    @Mapping(source = "moddate", target = "moddate", qualifiedByName = "dateToString")
    NoteResponseDTO toNoteResponseDTO(Note note);

    // 상세 조회용
    @Mapping(source = "session.sessionId", target = "sessionId")
    @Mapping(source = "sourceType", target = "sourceType", qualifiedByName = "enumToString")
    @Mapping(source = "status", target = "status", qualifiedByName = "enumToString")
    @Mapping(source = "regdate", target = "regdate", qualifiedByName = "dateToString")
    @Mapping(source = "moddate", target = "moddate", qualifiedByName = "dateToString")
    @Mapping(source = "summaryOption", target = "summaryOption", qualifiedByName = "jsonStringToJsonNode")
    NoteDetailResponseDTO toNoteDetailResponseDTO(Note note);


    /* =========================
       JSON String → JsonNode
       ========================= */
    @Named("jsonStringToJsonNode")
    default com.fasterxml.jackson.databind.JsonNode jsonStringToJsonNode(String json) {
        if (json == null) return null;
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("summaryOption JSON 파싱 실패", e);
        }
    }


    // 리스트 변환
    List<NoteResponseDTO> toNoteResponseDTOList(List<Note> notes);

    // Enum → String 변환
    @Named("enumToString")
    default String enumToString(Enum<?> value) {
        return value != null ? value.name() : null;
    }

    // LocalDateTime → String 변환
    @Named("dateToString")
    default String dateToString(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.toString() : null;
    }
}