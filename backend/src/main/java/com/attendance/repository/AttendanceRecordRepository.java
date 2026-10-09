package com.attendance.repository;

import com.attendance.entity.AttendanceRecord;
import com.attendance.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findBySessionId(Long sessionId);
    List<AttendanceRecord> findByStudentId(Long studentId);
    Optional<AttendanceRecord> findBySessionIdAndStudentId(Long sessionId, Long studentId);

    @Query("SELECT r FROM AttendanceRecord r WHERE r.student.id = :studentId AND r.session.sessionDate = :date")
    List<AttendanceRecord> findByStudentIdAndDate(@Param("studentId") Long studentId, @Param("date") LocalDate date);

    @Query("SELECT r FROM AttendanceRecord r WHERE r.student.id = :studentId AND r.session.subject.id = :subjectId")
    List<AttendanceRecord> findByStudentIdAndSubjectId(@Param("studentId") Long studentId, @Param("subjectId") Long subjectId);

    @Query("SELECT r FROM AttendanceRecord r WHERE r.session.sessionDate = :date")
    List<AttendanceRecord> findBySessionDate(@Param("date") LocalDate date);

    @Query("SELECT r FROM AttendanceRecord r WHERE r.session.sessionDate BETWEEN :startDate AND :endDate")
    List<AttendanceRecord> findBySessionDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    Long countBySessionSessionDateAndStatus(LocalDate date, AttendanceStatus status);
    
    Long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);
    
    Long countByStudentId(Long studentId);
}
