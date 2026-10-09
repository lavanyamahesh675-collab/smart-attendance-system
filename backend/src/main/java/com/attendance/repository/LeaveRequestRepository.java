package com.attendance.repository;

import com.attendance.entity.LeaveRequest;
import com.attendance.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStudentId(Long studentId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByStudentDepartmentId(Long departmentId);
    Long countByStatus(LeaveStatus status);
}
