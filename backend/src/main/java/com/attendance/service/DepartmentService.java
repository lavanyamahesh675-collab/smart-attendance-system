package com.attendance.service;

import com.attendance.dto.CourseDTO;
import com.attendance.dto.DepartmentDTO;
import com.attendance.dto.SubjectDTO;
import com.attendance.entity.Course;
import com.attendance.entity.Department;
import com.attendance.entity.Faculty;
import com.attendance.entity.Subject;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::convertToDeptDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToCourseDTO)
                .collect(Collectors.toList());
    }

    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::convertToSubjectDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        Department dept = Department.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        dept = departmentRepository.save(dept);
        return convertToDeptDTO(dept);
    }

    @Transactional
    public SubjectDTO createSubject(SubjectDTO dto) {
        Course course = dto.getCourseId() != null ?
                courseRepository.findById(dto.getCourseId()).orElse(null) : null;
        Faculty faculty = dto.getFacultyId() != null ?
                facultyRepository.findById(dto.getFacultyId()).orElse(null) : null;

        Subject subject = Subject.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .credits(dto.getCredits() != null ? dto.getCredits() : 3)
                .course(course)
                .faculty(faculty)
                .build();

        subject = subjectRepository.save(subject);
        return convertToSubjectDTO(subject);
    }

    private DepartmentDTO convertToDeptDTO(Department dept) {
        int studentCount = studentRepository.findByDepartmentId(dept.getId()).size();
        int facultyCount = facultyRepository.findByDepartmentId(dept.getId()).size();
        return DepartmentDTO.builder()
                .id(dept.getId())
                .code(dept.getCode())
                .name(dept.getName())
                .description(dept.getDescription())
                .studentCount(studentCount)
                .facultyCount(facultyCount)
                .build();
    }

    private CourseDTO convertToCourseDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .departmentId(course.getDepartment() != null ? course.getDepartment().getId() : null)
                .departmentName(course.getDepartment() != null ? course.getDepartment().getName() : "")
                .build();
    }

    private SubjectDTO convertToSubjectDTO(Subject subject) {
        return SubjectDTO.builder()
                .id(subject.getId())
                .code(subject.getCode())
                .name(subject.getName())
                .credits(subject.getCredits())
                .courseId(subject.getCourse() != null ? subject.getCourse().getId() : null)
                .courseName(subject.getCourse() != null ? subject.getCourse().getName() : "")
                .facultyId(subject.getFaculty() != null ? subject.getFaculty().getId() : null)
                .facultyName(subject.getFaculty() != null && subject.getFaculty().getUser() != null ? 
                        subject.getFaculty().getUser().getFullName() : "Unassigned")
                .build();
    }
}
