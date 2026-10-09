package com.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "biometric_devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiometricDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_code", unique = true, nullable = false)
    private String deviceCode;

    @Column(name = "device_name", nullable = false)
    private String deviceName;

    private String location;

    @Column(name = "ip_address")
    private String ipAddress;

    private String status; // ONLINE, OFFLINE, MAINTENANCE

    @Column(name = "last_ping")
    private LocalDateTime lastPing;
}
