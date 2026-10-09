package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentDTO {
    private Long id;
    private Long userId;
    private String studentId;
    private String rollNo;
    private String fullName;
    private String email;
    private String phone;
    private String avatar;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Long courseId;
    private String courseName;
    private Integer semester;
    private String batch;
    private boolean biometricRegistered;
    private Double attendancePercentage;
}
