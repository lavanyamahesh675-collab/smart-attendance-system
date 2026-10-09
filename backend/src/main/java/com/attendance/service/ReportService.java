package com.attendance.service;

import com.attendance.dto.AttendanceRecordDTO;
import com.attendance.dto.LeaveRequestDTO;
import com.attendance.dto.StudentDTO;
import com.attendance.entity.AttendanceRecord;
import com.attendance.repository.AttendanceRecordRepository;
import com.attendance.repository.LeaveRequestRepository;
import com.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private AttendanceRecordRepository recordRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LeaveRequestRepository leaveRepository;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private LeaveService leaveService;

    public List<AttendanceRecordDTO> getDailyReport(LocalDate date) {
        LocalDate reportDate = date != null ? date : LocalDate.now();
        return recordRepository.findBySessionDate(reportDate).stream()
                .map(attendanceService::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDTO> getRangeReport(LocalDate startDate, LocalDate endDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = endDate != null ? endDate : LocalDate.now();
        return recordRepository.findBySessionDateBetween(start, end).stream()
                .map(attendanceService::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<StudentDTO> getLowAttendanceReport(Double threshold) {
        double limit = threshold != null ? threshold : 75.0;
        return studentService.getAllStudents().stream()
                .filter(s -> s.getAttendancePercentage() < limit)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getLeaveReport() {
        return leaveService.getAllLeaves();
    }

    public Map<String, Object> getDepartmentReport(Long departmentId) {
        List<StudentDTO> students = studentService.getAllStudents().stream()
                .filter(s -> departmentId == null || departmentId.equals(s.getDepartmentId()))
                .collect(Collectors.toList());

        double avgPct = students.isEmpty() ? 0.0 : students.stream()
                .mapToDouble(StudentDTO::getAttendancePercentage)
                .average()
                .orElse(0.0);

        long lowAttCount = students.stream().filter(s -> s.getAttendancePercentage() < 75.0).count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalStudents", students.size());
        report.put("averageAttendancePercentage", Math.round(avgPct * 10.0) / 10.0);
        report.put("lowAttendanceCount", lowAttCount);
        report.put("students", students);
        return report;
    }
}
