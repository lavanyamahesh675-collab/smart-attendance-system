package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubjectDTO {
    private Long id;
    private String code;
    private String name;
    private Integer credits;
    private Long courseId;
    private String courseName;
    private Long facultyId;
    private String facultyName;
}
