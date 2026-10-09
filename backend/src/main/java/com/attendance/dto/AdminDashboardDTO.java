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
public class AdminDashboardDTO {
    private Long totalStudents;
    private Long totalFaculty;
    private Long todayPresent;
    private Long todayAbsent;
    private Long onLeave;
    private Long lateArrivals;
    private Double overallAttendancePercentage;
    private Long pendingLeaveRequests;

    private List<Map<String, Object>> attendanceTrend; // Date-wise attendance %
    private List<Map<String, Object>> presentVsAbsent; // Status counts
    private List<Map<String, Object>> departmentAttendance; // Dept-wise %
    private List<Map<String, Object>> leaveStats; // Approved, Pending, Rejected counts
    private List<Map<String, Object>> recentActivity; // Feed: e.g. "09:02 AM - Rahul marked Present"
}
