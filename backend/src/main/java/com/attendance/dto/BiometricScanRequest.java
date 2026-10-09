package com.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BiometricScanRequest {
    @NotBlank(message = "Student ID or Roll No is required")
    private String studentId;

    private String deviceCode; // e.g. BIO-001
    private Long subjectId;    // Optional, defaults to today's current session
    private String fingerprintTemplate; // Simulated hash
}
