package com.attendance.service;

import com.attendance.dto.StudentDTO;
import com.attendance.entity.*;
import com.attendance.exception.StudentNotFoundException;
import com.attendance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
        .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + id));
        return convertToDTO(student);
    }

    public StudentDTO getStudentByCustomId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with Student ID: " + studentId));
        return convertToDTO(student);
    }

    public StudentDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found for User ID: " + userId));
        return convertToDTO(student);
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        // Create underlying User
        User user = User.builder()
                .username(dto.getStudentId().toLowerCase())
                .email(dto.getEmail() != null ? dto.getEmail() : dto.getStudentId().toLowerCase() + "@bioattend.edu")
                .password(passwordEncoder.encode("Student@123"))
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .avatar(dto.getAvatar() != null ? dto.getAvatar() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + dto.getStudentId())
                .role(Role.ROLE_STUDENT)
                .active(true)
                .build();

        user = userRepository.save(user);

        Department dept = dto.getDepartmentId() != null ? 
                departmentRepository.findById(dto.getDepartmentId()).orElse(null) : null;
        Course course = dto.getCourseId() != null ? 
                courseRepository.findById(dto.getCourseId()).orElse(null) : null;

        Student student = Student.builder()
                .user(user)
                .studentId(dto.getStudentId())
                .rollNo(dto.getRollNo() != null ? dto.getRollNo() : dto.getStudentId())
                .department(dept)
                .course(course)
                .semester(dto.getSemester() != null ? dto.getSemester() : 1)
                .batch(dto.getBatch() != null ? dto.getBatch() : "2024-2028")
                .biometricRegistered(true)
                .fingerprintHash("BIO_HASH_" + dto.getStudentId())
                .build();

        student = studentRepository.save(student);
        return convertToDTO(student);
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + id));

        User user = student.getUser();
        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getRollNo() != null) student.setRollNo(dto.getRollNo());
        if (dto.getSemester() != null) student.setSemester(dto.getSemester());
        if (dto.getBatch() != null) student.setBatch(dto.getBatch());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
            student.setDepartment(dept);
        }

        if (dto.getCourseId() != null) {
            Course course = courseRepository.findById(dto.getCourseId()).orElse(null);
            student.setCourse(course);
        }

        student = studentRepository.save(student);
        return convertToDTO(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }

    public StudentDTO convertToDTO(Student student) {
        Long total = attendanceRecordRepository.countByStudentId(student.getId());
        Long present = attendanceRecordRepository.countByStudentIdAndStatus(student.getId(), AttendanceStatus.PRESENT);
        Long late = attendanceRecordRepository.countByStudentIdAndStatus(student.getId(), AttendanceStatus.LATE);

        double pct = (total == 0) ? 100.0 : ((double)(present + late) / total) * 100.0;
        pct = Math.round(pct * 10.0) / 10.0;

        return StudentDTO.builder()
                .id(student.getId())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .studentId(student.getStudentId())
                .rollNo(student.getRollNo())
                .fullName(student.getUser() != null ? student.getUser().getFullName() : "")
                .email(student.getUser() != null ? student.getUser().getEmail() : "")
                .phone(student.getUser() != null ? student.getUser().getPhone() : "")
                .avatar(student.getUser() != null ? student.getUser().getAvatar() : "")
                .departmentId(student.getDepartment() != null ? student.getDepartment().getId() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : "")
                .departmentCode(student.getDepartment() != null ? student.getDepartment().getCode() : "")
                .courseId(student.getCourse() != null ? student.getCourse().getId() : null)
                .courseName(student.getCourse() != null ? student.getCourse().getName() : "")
                .semester(student.getSemester())
                .batch(student.getBatch())
                .biometricRegistered(student.isBiometricRegistered())
                .attendancePercentage(pct)
                .build();
    }
}
