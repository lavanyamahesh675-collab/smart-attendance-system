package com.attendance.controller;

import com.attendance.dto.BiometricScanRequest;
import com.attendance.dto.BiometricScanResponse;
import com.attendance.entity.BiometricDevice;
import com.attendance.entity.BiometricLog;
import com.attendance.service.BiometricService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/biometric")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BiometricController {

    @Autowired
    private BiometricService biometricService;

    @GetMapping("/device-status")
    public ResponseEntity<Map<String, Object>> getDeviceStatus() {
        List<BiometricDevice> devices = biometricService.getDevices();
        Map<String, Object> status = new HashMap<>();
        status.put("connected", true);
        status.put("status", "ONLINE");
        status.put("deviceCount", devices.size());
        status.put("activeDevice", devices.isEmpty() ? "BIO-001" : devices.get(0).getDeviceCode());
        status.put("location", devices.isEmpty() ? "Main Gate / Hall A" : devices.get(0).getLocation());
        status.put("devices", devices);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/simulate-scan")
    public ResponseEntity<BiometricScanResponse> processBiometricScan(@Valid @RequestBody BiometricScanRequest request) {
        BiometricScanResponse response = biometricService.processBiometricScan(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<BiometricLog>> getLogs() {
        return ResponseEntity.ok(biometricService.getLogs());
    }
}
