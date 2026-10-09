package com.attendance.service;

import com.attendance.dto.JwtResponse;
import com.attendance.dto.LoginRequest;
import com.attendance.entity.Faculty;
import com.attendance.entity.Student;
import com.attendance.entity.User;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import com.attendance.security.JwtUtils;
import com.attendance.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        String role = user.getRole().name();
        Long studentId = null;
        Long facultyId = null;
        String deptName = null;

        if ("ROLE_STUDENT".equals(role)) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                studentId = studentOpt.get().getId();
                if (studentOpt.get().getDepartment() != null) {
                    deptName = studentOpt.get().getDepartment().getName();
                }
            }
        } else if ("ROLE_FACULTY".equals(role)) {
            Optional<Faculty> facultyOpt = facultyRepository.findByUserId(user.getId());
            if (facultyOpt.isPresent()) {
                facultyId = facultyOpt.get().getId();
                if (facultyOpt.get().getDepartment() != null) {
                    deptName = facultyOpt.get().getDepartment().getName();
                }
            }
        }

        return JwtResponse.builder()
                .token(jwt)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .studentId(studentId)
                .facultyId(facultyId)
                .departmentName(deptName)
                .build();
    }
}
