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
public class AttendanceRecordDTO {
    private Long id;
    private Long sessionId;
    private Long studentId;
    private String studentCustomId; // e.g. STU1024
    private String studentName;
    private String rollNo;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private LocalDate sessionDate;
    private String status; // PRESENT, ABSENT, LATE, HALF_DAY, LEAVE
    private LocalDateTime markedTime;
    private boolean isBiometric;
    private String deviceId;
    private String remarks;
}
