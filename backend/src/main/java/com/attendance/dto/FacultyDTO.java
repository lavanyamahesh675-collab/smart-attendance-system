package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacultyDTO {
    private Long id;
    private Long userId;
    private String employeeId;
    private String fullName;
    private String email;
    private String phone;
    private String avatar;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private LocalDate joinDate;
}
