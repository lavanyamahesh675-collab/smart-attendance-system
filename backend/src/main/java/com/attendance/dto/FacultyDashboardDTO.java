package com.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacultyDashboardDTO {
    private String facultyName;
    private String departmentName;
    private Long myClassesCount;
    private Long todayClassesCount;
    private Long totalStudents;
    private Long todayAttendanceMarkedCount;
    private Long pendingLeaveRequestsCount;

    private List<SubjectDTO> assignedSubjects;
    private List<AttendanceRecordDTO> recentClassAttendance;
    private List<LeaveRequestDTO> pendingLeaves;
}
