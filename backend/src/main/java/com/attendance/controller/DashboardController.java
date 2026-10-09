package com.attendance.controller;

import com.attendance.dto.AdminDashboardDTO;
import com.attendance.dto.FacultyDashboardDTO;
import com.attendance.dto.StudentDashboardDTO;
import com.attendance.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(userId));
    }

    @GetMapping("/faculty/{userId}")
    public ResponseEntity<FacultyDashboardDTO> getFacultyDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getFacultyDashboard(userId));
    }
}
