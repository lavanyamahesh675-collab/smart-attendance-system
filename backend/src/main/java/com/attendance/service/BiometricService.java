package com.attendance.service;

import com.attendance.dto.BiometricScanRequest;
import com.attendance.dto.BiometricScanResponse;
import com.attendance.entity.*;
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

@Service
public class BiometricService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BiometricDeviceRepository deviceRepository;

    @Autowired
    private BiometricLogRepository logRepository;

    @Autowired
    private AttendanceSessionRepository sessionRepository;

    @Autowired
    private AttendanceRecordRepository recordRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Transactional
    public BiometricScanResponse processBiometricScan(BiometricScanRequest request) {
        String deviceCode = request.getDeviceCode() != null ? request.getDeviceCode() : "BIO-001";
        BiometricDevice device = deviceRepository.findByDeviceCode(deviceCode)
                .orElseGet(() -> deviceRepository.save(BiometricDevice.builder()
                        .deviceCode(deviceCode)
                        .deviceName("Console Reader " + deviceCode)
                        .location("Main Gate / Hall A")
                        .status("ONLINE")
                        .ipAddress("192.168.1.105")
                        .lastPing(LocalDateTime.now())
                        .build()));

        // Update device last ping
        device.setLastPing(LocalDateTime.now());
        deviceRepository.save(device);

        // Find Student by Student ID or Roll No
        Optional<Student> studentOpt = studentRepository.findByStudentId(request.getStudentId())
                .or(() -> studentRepository.findAll().stream()
                        .filter(s -> s.getRollNo() != null && s.getRollNo().equalsIgnoreCase(request.getStudentId()))
                        .findFirst());

        if (studentOpt.isEmpty()) {
            // Log failure
            logRepository.save(BiometricLog.builder()
                    .device(device)
                    .studentId(request.getStudentId())
                    .studentName("UNKNOWN")
                    .rawData("ID:" + request.getStudentId() + "|FP:SIMULATED")
                    .verificationResult("FAILED")
                    .statusAssigned("NONE")
                    .timestamp(LocalDateTime.now())
                    .build());

            return BiometricScanResponse.builder()
                    .success(false)
                    .verificationResult("FAILED")
                    .message("❌ Fingerprint Verification Failed: Student ID/Biometric profile not found.")
                    .studentId(request.getStudentId())
                    .deviceCode(device.getDeviceCode())
                    .deviceLocation(device.getLocation())
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        Student student = studentOpt.get();
        LocalDate today = LocalDate.now();

        // Get or create today's default attendance session
        List<AttendanceSession> todaySessions = sessionRepository.findBySessionDate(today);
        AttendanceSession currentSession;
        if (!todaySessions.isEmpty()) {
            currentSession = todaySessions.get(0);
        } else {
            Subject defaultSubject = subjectRepository.findAll().stream().findFirst().orElse(null);
            currentSession = sessionRepository.save(AttendanceSession.builder()
                    .subject(defaultSubject)
                    .sessionDate(today)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(10, 0))
                    .roomNo("Lab 3")
                    .status("ACTIVE")
                    .build());
        }

        // Check duplicate attendance for today's session
        Optional<AttendanceRecord> existingRecord = recordRepository.findBySessionIdAndStudentId(currentSession.getId(), student.getId());
        if (existingRecord.isPresent()) {
            logRepository.save(BiometricLog.builder()
                    .device(device)
                    .studentId(student.getStudentId())
                    .studentName(student.getUser().getFullName())
                    .rawData("ID:" + student.getStudentId() + "|FP:MATCHED")
                    .verificationResult("DUPLICATE")
                    .statusAssigned("DUPLICATE_SKIPPED")
                    .timestamp(LocalDateTime.now())
                    .build());

            return BiometricScanResponse.builder()
                    .success(false)
                    .verificationResult("DUPLICATE")
                    .message("⚠ Attendance already recorded today for " + student.getUser().getFullName() + ".")
                    .studentName(student.getUser().getFullName())
                    .studentId(student.getStudentId())
                    .rollNo(student.getRollNo())
                    .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : "")
                    .status(existingRecord.get().getStatus().name())
                    .timeFormatted(existingRecord.get().getMarkedTime().format(DateTimeFormatter.ofPattern("hh:mm a")))
                    .deviceCode(device.getDeviceCode())
                    .deviceLocation(device.getLocation())
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        // Determine PRESENT vs LATE (if scanned after 09:15 AM)
        LocalTime now = LocalTime.now();
        AttendanceStatus status = (now.isAfter(LocalTime.of(9, 15))) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        AttendanceRecord newRecord = AttendanceRecord.builder()
                .session(currentSession)
                .student(student)
                .status(status)
                .markedTime(LocalDateTime.now())
                .isBiometric(true)
                .deviceId(device.getDeviceCode())
                .remarks("Simulated Biometric Check-in")
                .build();

        newRecord = recordRepository.save(newRecord);

        logRepository.save(BiometricLog.builder()
                .device(device)
                .studentId(student.getStudentId())
                .studentName(student.getUser().getFullName())
                .rawData("ID:" + student.getStudentId() + "|FP:MATCHED_HASH_" + student.getStudentId())
                .verificationResult("MATCHED")
                .statusAssigned(status.name())
                .timestamp(LocalDateTime.now())
                .build());

        String timeFormatted = LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));

        return BiometricScanResponse.builder()
                .success(true)
                .verificationResult("MATCHED")
                .message("✓ Identity Verified - Attendance Marked Automatically")
                .studentName(student.getUser().getFullName())
                .studentId(student.getStudentId())
                .rollNo(student.getRollNo())
                .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : "")
                .status(status.name())
                .timeFormatted(timeFormatted)
                .deviceCode(device.getDeviceCode())
                .deviceLocation(device.getLocation())
                .timestamp(LocalDateTime.now())
                .build();
    }

    public List<BiometricDevice> getDevices() {
        return deviceRepository.findAll();
    }

    public List<BiometricLog> getLogs() {
        return logRepository.findTop20ByOrderByTimestampDesc();
    }
}
