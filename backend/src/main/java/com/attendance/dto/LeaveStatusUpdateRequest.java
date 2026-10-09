package com.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeaveStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status; // APPROVED, REJECTED, CANCELLED

    private String remarks;
}
