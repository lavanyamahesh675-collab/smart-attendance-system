package com.attendance.service;

import com.attendance.dto.LeaveApplyRequest;
import com.attendance.dto.LeaveRequestDTO;
import com.attendance.dto.LeaveStatusUpdateRequest;
import com.attendance.entity.*;
import com.attendance.exception.InvalidLeaveRequestException;
import com.attendance.exception.LeaveNotFoundException;
import com.attendance.exception.StudentNotFoundException;
import com.attendance.repository.LeaveRequestRepository;
import com.attendance.repository.NotificationRepository;
import com.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<LeaveRequestDTO> getAllLeaves() {
        return leaveRequestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getStudentLeaves(Long studentId) {
        return leaveRequestRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getPendingLeaves() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequestDTO applyLeave(Long studentId, LeaveApplyRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + studentId));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new InvalidLeaveRequestException("End date cannot be before start date");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        LeaveType type;
        try {
            type = LeaveType.valueOf(request.getLeaveType().toUpperCase());
        } catch (Exception e) {
            type = LeaveType.PERSONAL;
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .student(student)
                .leaveType(type)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .numberOfDays((int) days)
                .reason(request.getReason())
                .documentUrl(request.getDocumentUrl())
                .status(LeaveStatus.PENDING)
                .build();

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        // Send notification to student confirming submission
        notificationRepository.save(Notification.builder()
                .user(student.getUser())
                .title("Leave Application Submitted")
                .message("Your " + type.name() + " leave request for " + days + " day(s) from " + request.getStartDate() + " to " + request.getEndDate() + " has been submitted for approval.")
                .type("INFO")
                .build());

        return convertToDTO(leaveRequest);
    }

    @Transactional
    public LeaveRequestDTO updateLeaveStatus(Long leaveId, LeaveStatusUpdateRequest request, String reviewerName) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new LeaveNotFoundException("Leave request not found with ID: " + leaveId));

        LeaveStatus newStatus;
        try {
            newStatus = LeaveStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            throw new InvalidLeaveRequestException("Invalid status: " + request.getStatus());
        }

        leaveRequest.setStatus(newStatus);
        leaveRequest.setReviewerRemarks(request.getRemarks());
        leaveRequest.setReviewedBy(reviewerName != null ? reviewerName : "Administrator");
        leaveRequest.setReviewedAt(LocalDateTime.now());

        leaveRequest = leaveRequestRepository.save(leaveRequest);

        // Notify student of approval/rejection
        String notificationType = newStatus == LeaveStatus.APPROVED ? "SUCCESS" : "ALERT";
        String statusSymbol = newStatus == LeaveStatus.APPROVED ? "✓" : "✕";
        String messageStr = statusSymbol + " Your leave request from " + leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate() + " has been " + newStatus.name() + ".";
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            messageStr += " Remarks: " + request.getRemarks();
        }

        notificationRepository.save(Notification.builder()
                .user(leaveRequest.getStudent().getUser())
                .title("Leave Request " + newStatus.name())
                .message(messageStr)
                .type(notificationType)
                .build());

        return convertToDTO(leaveRequest);
    }

    public LeaveRequestDTO convertToDTO(LeaveRequest request) {
        return LeaveRequestDTO.builder()
                .id(request.getId())
                .studentId(request.getStudent() != null ? request.getStudent().getId() : null)
                .studentCustomId(request.getStudent() != null ? request.getStudent().getStudentId() : "")
                .studentName(request.getStudent() != null && request.getStudent().getUser() != null ? request.getStudent().getUser().getFullName() : "")
                .departmentName(request.getStudent() != null && request.getStudent().getDepartment() != null ? request.getStudent().getDepartment().getName() : "")
                .leaveType(request.getLeaveType().name())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .numberOfDays(request.getNumberOfDays())
                .reason(request.getReason())
                .documentUrl(request.getDocumentUrl())
                .status(request.getStatus().name())
                .reviewerRemarks(request.getReviewerRemarks())
                .reviewedBy(request.getReviewedBy())
                .reviewedAt(request.getReviewedAt())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
