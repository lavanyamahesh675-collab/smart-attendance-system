package com.attendance.controller;

import com.attendance.dto.LeaveApplyRequest;
import com.attendance.dto.LeaveRequestDTO;
import com.attendance.dto.LeaveStatusUpdateRequest;
import com.attendance.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LeaveRequestDTO>> getStudentLeaves(@PathVariable Long studentId) {
        return ResponseEntity.ok(leaveService.getStudentLeaves(studentId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<List<LeaveRequestDTO>> getPendingLeaves() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<LeaveRequestDTO> applyLeave(
            @PathVariable Long studentId,
            @Valid @RequestBody LeaveApplyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.applyLeave(studentId, request));
    }

    @PutMapping("/{leaveId}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<LeaveRequestDTO> approveLeave(
            @PathVariable Long leaveId,
            @RequestBody(required = false) LeaveStatusUpdateRequest request,
            Authentication authentication) {
        LeaveStatusUpdateRequest updateReq = request != null ? request : new LeaveStatusUpdateRequest();
        updateReq.setStatus("APPROVED");
        return ResponseEntity.ok(leaveService.updateLeaveStatus(leaveId, updateReq, authentication.getName()));
    }

    @PutMapping("/{leaveId}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<LeaveRequestDTO> rejectLeave(
            @PathVariable Long leaveId,
            @RequestBody(required = false) LeaveStatusUpdateRequest request,
            Authentication authentication) {
        LeaveStatusUpdateRequest updateReq = request != null ? request : new LeaveStatusUpdateRequest();
        updateReq.setStatus("REJECTED");
        return ResponseEntity.ok(leaveService.updateLeaveStatus(leaveId, updateReq, authentication.getName()));
    }

    @PutMapping("/{leaveId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<LeaveRequestDTO> updateStatus(
            @PathVariable Long leaveId,
            @Valid @RequestBody LeaveStatusUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(leaveId, request, authentication.getName()));
    }
}
