package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BiometricScanResponse {
    private boolean success;
    private String verificationResult; // VERIFIED, FAILED, DUPLICATE
    private String message;
    private String studentName;
    private String studentId;
    private String rollNo;
    private String departmentName;
    private String status; // PRESENT, LATE, DUPLICATE
    private String timeFormatted;
    private String deviceCode;
    private String deviceLocation;
    private LocalDateTime timestamp;
}
