package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveRequestDTO {
    private Long id;
    private Long studentId;
    private String studentCustomId;
    private String studentName;
    private String departmentName;
    private String leaveType; // MEDICAL, PERSONAL, EMERGENCY, ACADEMIC, OTHER
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfDays;
    private String reason;
    private String documentUrl;
    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String reviewerRemarks;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
}
