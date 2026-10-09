package com.attendance.repository;

import com.attendance.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    List<AttendanceSession> findBySessionDate(LocalDate sessionDate);
    List<AttendanceSession> findByFacultyId(Long facultyId);
    List<AttendanceSession> findBySubjectId(Long subjectId);
    Optional<AttendanceSession> findBySubjectIdAndSessionDate(Long subjectId, LocalDate sessionDate);
}
