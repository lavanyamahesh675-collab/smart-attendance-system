package com.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "student_id", unique = true, nullable = false)
    private String studentId;

    @Column(name = "roll_no")
    private String rollNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    private Course course;

    private Integer semester;

    private String batch;

    @Builder.Default
    @Column(name = "biometric_registered")
    private boolean biometricRegistered = true;

    @Column(name = "fingerprint_hash")
    private String fingerprintHash;
}
