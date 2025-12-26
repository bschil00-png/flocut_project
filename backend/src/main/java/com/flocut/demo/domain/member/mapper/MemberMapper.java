package com.flocut.demo.domain.member.mapper;

import com.flocut.demo.domain.member.dto.MemberDTO;
import com.flocut.demo.domain.member.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    // Entity -> DTO

    @Mapping(
            target = "role",
            expression = "java(member.getRole() != null ? member.getRole().name() : null)"
    )
    @Mapping(target = "status", expression = "java(member.getStatus() != null ? member.getStatus().name() : null)")
    @Mapping(target = "regdate", expression = "java(member.getRegdate() != null ? member.getRegdate().toString() : null)")
    @Mapping(target = "moddate", expression = "java(member.getModdate() != null ? member.getModdate().toString() : null)")
    MemberDTO toDto(Member member);
}