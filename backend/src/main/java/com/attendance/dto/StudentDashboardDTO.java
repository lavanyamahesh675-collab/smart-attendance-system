package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentDashboardDTO {
    private String studentName;
    private String studentId;
    private Double overallAttendancePercentage;
    private Long presentCount;
    private Long absentCount;
    private Long leaveCount;
    private Long lateCount;

    private List<Map<String, Object>> subjectWiseAttendance;
    private List<AttendanceRecordDTO> recentAttendance;
    private List<LeaveRequestDTO> recentLeaves;
    private boolean lowAttendanceAlert; // < 75%
    private boolean criticalAttendanceAlert; // < 65%
}
