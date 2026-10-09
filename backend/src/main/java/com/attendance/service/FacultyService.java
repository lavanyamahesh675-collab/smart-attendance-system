package com.attendance.service;

import com.attendance.dto.FacultyDTO;
import com.attendance.entity.Department;
import com.attendance.entity.Faculty;
import com.attendance.entity.Role;
import com.attendance.entity.User;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.DepartmentRepository;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<FacultyDTO> getAllFaculty() {
        return facultyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FacultyDTO getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));
        return convertToDTO(faculty);
    }

    public FacultyDTO getFacultyByUserId(Long userId) {
        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found for User ID: " + userId));
        return convertToDTO(faculty);
    }

    @Transactional
    public FacultyDTO createFaculty(FacultyDTO dto) {
        User user = User.builder()
                .username(dto.getEmployeeId().toLowerCase())
                .email(dto.getEmail() != null ? dto.getEmail() : dto.getEmployeeId().toLowerCase() + "@bioattend.edu")
                .password(passwordEncoder.encode("Faculty@123"))
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .avatar(dto.getAvatar() != null ? dto.getAvatar() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + dto.getEmployeeId())
                .role(Role.ROLE_FACULTY)
                .active(true)
                .build();

        user = userRepository.save(user);

        Department dept = dto.getDepartmentId() != null ? 
                departmentRepository.findById(dto.getDepartmentId()).orElse(null) : null;

        Faculty faculty = Faculty.builder()
                .user(user)
                .employeeId(dto.getEmployeeId())
                .department(dept)
                .designation(dto.getDesignation() != null ? dto.getDesignation() : "Assistant Professor")
                .joinDate(dto.getJoinDate() != null ? dto.getJoinDate() : LocalDate.now())
                .build();

        faculty = facultyRepository.save(faculty);
        return convertToDTO(faculty);
    }

    @Transactional
    public FacultyDTO updateFaculty(Long id, FacultyDTO dto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));

        User user = faculty.getUser();
        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getDesignation() != null) faculty.setDesignation(dto.getDesignation());
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
            faculty.setDepartment(dept);
        }

        faculty = facultyRepository.save(faculty);
        return convertToDTO(faculty);
    }

    @Transactional
    public void deleteFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));
        facultyRepository.delete(faculty);
    }

    public FacultyDTO convertToDTO(Faculty faculty) {
        return FacultyDTO.builder()
                .id(faculty.getId())
                .userId(faculty.getUser() != null ? faculty.getUser().getId() : null)
                .employeeId(faculty.getEmployeeId())
                .fullName(faculty.getUser() != null ? faculty.getUser().getFullName() : "")
                .email(faculty.getUser() != null ? faculty.getUser().getEmail() : "")
                .phone(faculty.getUser() != null ? faculty.getUser().getPhone() : "")
                .avatar(faculty.getUser() != null ? faculty.getUser().getAvatar() : "")
                .departmentId(faculty.getDepartment() != null ? faculty.getDepartment().getId() : null)
                .departmentName(faculty.getDepartment() != null ? faculty.getDepartment().getName() : "")
                .designation(faculty.getDesignation())
                .joinDate(faculty.getJoinDate())
                .build();
    }
}
