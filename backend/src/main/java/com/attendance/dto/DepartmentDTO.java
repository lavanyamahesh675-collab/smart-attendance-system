package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DepartmentDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer studentCount;
    private Integer facultyCount;
}
