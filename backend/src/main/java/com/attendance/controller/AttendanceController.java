package com.attendance.controller;

import com.attendance.dto.AttendanceMarkRequest;
import com.attendance.dto.AttendanceRecordDTO;
import com.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceRecordDTO>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendanceRecords());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceRecordDTO>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceRecordDTO>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<AttendanceRecordDTO>> getAttendanceBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(attendanceService.getAttendanceBySubject(subjectId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<AttendanceRecordDTO> markAttendance(@Valid @RequestBody AttendanceMarkRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }

    @PutMapping("/{recordId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<AttendanceRecordDTO> updateAttendance(
            @PathVariable Long recordId,
            @RequestParam String status,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(attendanceService.updateAttendance(recordId, status, remarks));
    }
}
