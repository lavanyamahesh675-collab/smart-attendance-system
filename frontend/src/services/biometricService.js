import api from './api';
import { markAttendance } from './attendanceService';

const initialLogs = [
  { id: 1, studentId: "STU1001", studentName: "Rahul Kumar", verificationResult: "MATCHED", statusAssigned: "PRESENT", timestamp: new Date().toISOString() },
  { id: 2, studentId: "STU1002", studentName: "Anjali Sharma", verificationResult: "MATCHED", statusAssigned: "PRESENT", timestamp: new Date().toISOString() },
  { id: 3, studentId: "STU1003", studentName: "Kiran Patel", verificationResult: "DUPLICATE", statusAssigned: "DUPLICATE_SKIPPED", timestamp: new Date().toISOString() }
];

const getStoredLogs = () => {
  const stored = localStorage.getItem('bioattend_biometric_logs');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('bioattend_biometric_logs', JSON.stringify(initialLogs));
  return initialLogs;
};

const saveStoredLogs = (logs) => {
  localStorage.setItem('bioattend_biometric_logs', JSON.stringify(logs));
};

export const getDeviceStatus = async () => {
  try {
    const response = await api.get('/biometric/device-status');
    return response.data;
  } catch (err) {
    return {
      connected: true,
      status: "ONLINE",
      deviceCount: 2,
      activeDevice: "BIO-001",
      location: "Academic Block A / Main Gate",
      devices: [
        { id: 1, deviceCode: "BIO-001", deviceName: "Main Gate Terminal", location: "Academic Block A", status: "ONLINE" },
        { id: 2, deviceCode: "BIO-002", deviceName: "Lab 3 Scanner", location: "Computer Center Lab 3", status: "ONLINE" }
      ]
    };
  }
};

export const simulateBiometricScan = async (studentId, deviceCode = 'BIO-001') => {
  const sId = (studentId || '').trim().toUpperCase();

  if (sId === 'STU9999' || sId === 'UNKNOWN') {
    const failedLog = {
      id: Date.now(),
      studentId: sId,
      studentName: "Unknown Profile",
      verificationResult: "FAILED",
      statusAssigned: "FAILED",
      timestamp: new Date().toISOString()
    };
    const currentLogs = getStoredLogs();
    saveStoredLogs([failedLog, ...currentLogs]);

    return {
      success: false,
      verificationResult: "FAILED",
      message: "❌ Fingerprint Verification Failed: Student ID/Biometric profile not found.",
      studentId: sId,
      deviceCode: deviceCode,
      deviceLocation: "Academic Block A",
      timestamp: new Date().toISOString()
    };
  }

  const now = new Date();
  const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
  const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const studentName = sId === 'STU1001' ? 'Rahul Kumar' : sId === 'STU1002' ? 'Anjali Sharma' : sId === 'STU1003' ? 'Kiran Patel' : 'Enrolled Student';

  const scanResult = {
    success: true,
    verificationResult: "MATCHED",
    message: "✓ Identity Verified - Attendance Marked Automatically",
    studentName: studentName,
    studentId: sId,
    rollNo: "21010" + sId.replace(/\D/g, ''),
    departmentName: "Computer Science & Engineering",
    status: isLate ? "LATE" : "PRESENT",
    timeFormatted: timeFormatted,
    deviceCode: deviceCode,
    deviceLocation: "Academic Block A",
    timestamp: now.toISOString()
  };

  // Persist log
  const newLog = {
    id: Date.now(),
    studentId: sId,
    studentName: studentName,
    verificationResult: "MATCHED",
    statusAssigned: scanResult.status,
    timestamp: scanResult.timestamp
  };
  const currentLogs = getStoredLogs();
  saveStoredLogs([newLog, ...currentLogs]);

  // Persist attendance marking
  markAttendance({
    studentCustomId: sId,
    studentName: studentName,
    rollNo: scanResult.rollNo,
    subjectName: "CS301 Data Structures",
    status: scanResult.status,
    isBiometric: true,
    deviceId: deviceCode
  });

  return scanResult;
};

export const getBiometricLogs = async () => {
  try {
    const response = await api.get('/biometric/logs');
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  return getStoredLogs();
};
