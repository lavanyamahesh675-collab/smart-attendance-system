# BioAttend REST API Documentation

## Authentication Endpoints
- `POST /api/auth/login`
  - Body: `{ "username": "admin", "password": "Admin@123" }`
  - Response: `{ "token": "JWT...", "role": "ROLE_ADMIN", "username": "admin", ... }`

- `GET /api/auth/me`
  - Returns current logged-in user profile from SecurityContext.

## Biometric Simulation Endpoints
- `GET /api/biometric/device-status`
  - Returns hardware terminal connectivity status, device code, and location.

- `POST /api/biometric/simulate-scan`
  - Body: `{ "studentId": "STU1001", "deviceCode": "BIO-001" }`
  - Response:
    ```json
    {
      "success": true,
      "verificationResult": "MATCHED",
      "message": "✓ Identity Verified",
      "studentName": "Rahul Kumar",
      "studentId": "STU1001",
      "status": "PRESENT",
      "timeFormatted": "09:02 AM",
      "deviceCode": "BIO-001"
    }
    ```

## Attendance Management Endpoints
- `GET /api/attendance`
- `GET /api/attendance/student/{studentId}`
- `GET /api/attendance/date/{date}`
- `POST /api/attendance`
- `PUT /api/attendance/{recordId}?status=PRESENT&remarks=Correction`

## Leave Management Endpoints
- `GET /api/leaves`
- `GET /api/leaves/pending`
- `POST /api/leaves/student/{studentId}`
- `PUT /api/leaves/{leaveId}/approve`
- `PUT /api/leaves/{leaveId}/reject`

## Dashboards & Reports
- `GET /api/dashboard/admin`
- `GET /api/dashboard/student/{userId}`
- `GET /api/dashboard/faculty/{userId}`
- `GET /api/reports/daily?date=2026-10-09`
- `GET /api/reports/low-attendance?threshold=75.0`
