package com.attendance.repository;

import com.attendance.entity.Faculty;
import com.attendance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmployeeId(String employeeId);
    Optional<Faculty> findByUser(User user);
    Optional<Faculty> findByUserId(Long userId);
    List<Faculty> findByDepartmentId(Long departmentId);
}
