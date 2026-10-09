package com.attendance.service;

import com.attendance.dto.AttendanceMarkRequest;
import com.attendance.dto.AttendanceRecordDTO;
import com.attendance.entity.*;
import com.attendance.exception.AttendanceAlreadyMarkedException;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.exception.StudentNotFoundException;
import com.attendance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public List<AttendanceRecordDTO> getAllAttendanceRecords() {
        return attendanceRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDTO> getStudentAttendance(Long studentId) {
        return attendanceRecordRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRecordRepository.findBySessionDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDTO> getAttendanceBySubject(Long subjectId) {
        List<AttendanceSession> sessions = attendanceSessionRepository.findBySubjectId(subjectId);
        return sessions.stream()
                .flatMap(s -> attendanceRecordRepository.findBySessionId(s.getId()).stream())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceRecordDTO markAttendance(AttendanceMarkRequest request) {
        AttendanceSession session = attendanceSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Attendance session not found with ID: " + request.getSessionId()));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + request.getStudentId()));

        // Check for duplicate attendance
        Optional<AttendanceRecord> existing = attendanceRecordRepository.findBySessionIdAndStudentId(session.getId(), student.getId());
        if (existing.isPresent()) {
            throw new AttendanceAlreadyMarkedException("Attendance already recorded for " + student.getUser().getFullName() + " for this session.");
        }

        AttendanceStatus status;
        try {
            status = AttendanceStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            status = AttendanceStatus.PRESENT;
        }

        AttendanceRecord record = AttendanceRecord.builder()
                .session(session)
                .student(student)
                .status(status)
                .markedTime(LocalDateTime.now())
                .isBiometric(false)
                .remarks(request.getRemarks())
                .build();

        record = attendanceRecordRepository.save(record);
        return convertToDTO(record);
    }

    @Transactional
    public AttendanceRecordDTO updateAttendance(Long recordId, String statusStr, String remarks) {
        AttendanceRecord record = attendanceRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with ID: " + recordId));

        try {
            record.setStatus(AttendanceStatus.valueOf(statusStr.toUpperCase()));
        } catch (Exception e) {
            // retain existing status if invalid
        }
        if (remarks != null) record.setRemarks(remarks);

        record = attendanceRecordRepository.save(record);
        return convertToDTO(record);
    }

    public AttendanceRecordDTO convertToDTO(AttendanceRecord record) {
        return AttendanceRecordDTO.builder()
                .id(record.getId())
                .sessionId(record.getSession() != null ? record.getSession().getId() : null)
                .studentId(record.getStudent() != null ? record.getStudent().getId() : null)
                .studentCustomId(record.getStudent() != null ? record.getStudent().getStudentId() : "")
                .studentName(record.getStudent() != null && record.getStudent().getUser() != null ? record.getStudent().getUser().getFullName() : "")
                .rollNo(record.getStudent() != null ? record.getStudent().getRollNo() : "")
                .subjectId(record.getSession() != null && record.getSession().getSubject() != null ? record.getSession().getSubject().getId() : null)
                .subjectCode(record.getSession() != null && record.getSession().getSubject() != null ? record.getSession().getSubject().getCode() : "")
                .subjectName(record.getSession() != null && record.getSession().getSubject() != null ? record.getSession().getSubject().getName() : "")
                .sessionDate(record.getSession() != null ? record.getSession().getSessionDate() : LocalDate.now())
                .status(record.getStatus().name())
                .markedTime(record.getMarkedTime())
                .isBiometric(record.isBiometric())
                .deviceId(record.getDeviceId())
                .remarks(record.getRemarks())
                .build();
    }
}
