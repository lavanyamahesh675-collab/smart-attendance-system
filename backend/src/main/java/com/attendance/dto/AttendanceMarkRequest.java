package com.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceMarkRequest {
    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Status is required")
    private String status; // PRESENT, ABSENT, LATE, HALF_DAY, LEAVE

    private String remarks;
}
