# Database ER Diagram & Architecture — BioAttend

## Entities & Relationships

```text
Department (1) ------------< (N) Student
Department (1) ------------< (N) Faculty
Department (1) ------------< (N) Course (1) ------------< (N) Subject

User (1) ------------------ (1) Student
User (1) ------------------ (1) Faculty

Student (1) ---------------< (N) AttendanceRecord
AttendanceSession (1) -----< (N) AttendanceRecord

Student (1) ---------------< (N) LeaveRequest
User (1) ------------------< (N) Notification

BiometricDevice (1) -------< (N) BiometricLog
```

## Table Definitions

### `users`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, BCrypt Hashed)
- `full_name` (VARCHAR)
- `phone` (VARCHAR)
- `role` (VARCHAR: ROLE_ADMIN, ROLE_FACULTY, ROLE_STUDENT)
- `active` (BOOLEAN)
- `created_at` (DATETIME)

### `students`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `user_id` (BIGINT, FK -> users.id)
- `student_id` (VARCHAR, UNIQUE, e.g. STU1001)
- `roll_no` (VARCHAR)
- `department_id` (BIGINT, FK -> departments.id)
- `course_id` (BIGINT, FK -> courses.id)
- `semester` (INT)
- `batch` (VARCHAR)
- `biometric_registered` (BOOLEAN)

### `attendance_records`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `session_id` (BIGINT, FK -> attendance_sessions.id)
- `student_id` (BIGINT, FK -> students.id)
- `status` (VARCHAR: PRESENT, ABSENT, LATE, HALF_DAY, LEAVE)
- `marked_time` (DATETIME)
- `is_biometric` (BOOLEAN)
- `device_id` (VARCHAR)
- `remarks` (VARCHAR)

### `leave_requests`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `student_id` (BIGINT, FK -> students.id)
- `leave_type` (VARCHAR: MEDICAL, PERSONAL, EMERGENCY, ACADEMIC, OTHER)
- `start_date` (DATE)
- `end_date` (DATE)
- `number_of_days` (INT)
- `reason` (TEXT)
- `status` (VARCHAR: PENDING, APPROVED, REJECTED, CANCELLED)
- `reviewer_remarks` (VARCHAR)
- `reviewed_by` (VARCHAR)
