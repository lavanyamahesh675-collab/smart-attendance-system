package com.attendance.repository;

import com.attendance.entity.BiometricLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BiometricLogRepository extends JpaRepository<BiometricLog, Long> {
    List<BiometricLog> findTop20ByOrderByTimestampDesc();
}
