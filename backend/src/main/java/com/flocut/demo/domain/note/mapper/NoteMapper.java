package com.flocut.demo.domain.note.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flocut.demo.domain.note.dto.response.NoteDetailResponseDTO;
import com.flocut.demo.domain.note.dto.response.NoteResponseDTO;
import com.flocut.demo.domain.note.entity.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface NoteMapper {


    @Mapping(source = "session.sessionId", target = "sessionId")
    @Mapping(source = "sourceType", target = "sourceType", qualifiedByName = "enumToString")
    @Mapping(source = "status", target = "status", qualifiedByName = "enumToString")
    @Mapping(source = "regdate", target = "regdate", qualifiedByName = "dateToString")
    @Mapping(source = "moddate", target = "moddate", qualifiedByName = "dateToString")
    @Mapping(source = "deletedAt", target = "deletedAt", qualifiedByName = "dateToString")
    NoteResponseDTO toNoteResponseDTO(Note note);

    @Mapping(source = "session.sessionId", target = "sessionId")
    @Mapping(source = "sourceType", target = "sourceType", qualifiedByName = "enumToString")
    @Mapping(source = "status", target = "status", qualifiedByName = "enumToString")
    @Mapping(source = "regdate", target = "regdate", qualifiedByName = "dateToString")
    @Mapping(source = "moddate", target = "moddate", qualifiedByName = "dateToString")
    @Mapping(source = "deletedAt", target = "deletedAt", qualifiedByName = "dateToString")
    @Mapping(target = "summaryOption", expression = "java(jsonToMap(note.getSummaryOption()))")
    NoteDetailResponseDTO toNoteDetailResponseDTO(Note note);


    // 리스트 변환
    List<NoteResponseDTO> toNoteResponseDTOList(List<Note> notes);

//     enum 스트링 변환
    @Named("enumToString")
    default String enumToString(Enum<?> value) {
        return (value != null) ? value.name() : null;
    }


//     LocalDateTime -> String 변환
    @Named("dateToString")
    default String dateToString(LocalDateTime dateTime) {
        return (dateTime != null) ? dateTime.toString() : null;
    }


//     DB의 JSON 문자열(summaryOption)을 GraphQL JSON 타입에 대응하도록 Map으로 변환
    @Named("jsonToObject")
    default Object jsonToMap(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return new ObjectMapper().readTree(json); // JsonNode 반환
        } catch (Exception e) {
            return null;
        }
    }

}