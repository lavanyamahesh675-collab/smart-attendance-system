package com.attendance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BioAttendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BioAttendApplication.class, args);
        System.out.println("\n-------------------------------------------------------------");
        System.out.println("  BioAttend — Smart Biometric Attendance & Leave System Started");
        System.out.println("  Backend Server URL: http://localhost:8080");
        System.out.println("  H2 Console:         http://localhost:8080/h2-console");
        System.out.println("-------------------------------------------------------------\n");
    }
}
