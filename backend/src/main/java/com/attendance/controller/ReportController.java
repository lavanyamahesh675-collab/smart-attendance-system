package com.attendance.controller;

import com.attendance.dto.AttendanceRecordDTO;
import com.attendance.dto.LeaveRequestDTO;
import com.attendance.dto.StudentDTO;
import com.attendance.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/daily")
    public ResponseEntity<List<AttendanceRecordDTO>> getDailyReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(reportService.getDailyReport(date));
    }

    @GetMapping("/range")
    public ResponseEntity<List<AttendanceRecordDTO>> getRangeReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(reportService.getRangeReport(startDate, endDate));
    }

    @GetMapping("/low-attendance")
    public ResponseEntity<List<StudentDTO>> getLowAttendanceReport(
            @RequestParam(required = false, defaultValue = "75.0") Double threshold) {
        return ResponseEntity.ok(reportService.getLowAttendanceReport(threshold));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveRequestDTO>> getLeaveReport() {
        return ResponseEntity.ok(reportService.getLeaveReport());
    }

    @GetMapping("/department")
    public ResponseEntity<Map<String, Object>> getDepartmentReport(
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(reportService.getDepartmentReport(departmentId));
    }
}
