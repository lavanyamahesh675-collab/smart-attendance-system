# BioAttend — Java Lab Viva Questions & Answers

### Q1: How are Java OOP principles implemented in BioAttend?
- **Encapsulation:** All JPA entity fields (e.g., `User`, `Student`, `AttendanceRecord`) use `private` access modifiers with getters, setters, and Lombok builders.
- **Inheritance & Interfaces:** Repositories extend `JpaRepository<T, ID>`, Spring Security implements `UserDetailsService` and `OncePerRequestFilter`.
- **Polymorphism:** Method overloading in repository query methods (`findByUserId`, `findByStudentIdAndDate`) and dynamic runtime resolution of Spring `@RestControllerAdvice` exception handlers.
- **Abstraction:** Services (`AttendanceService`, `BiometricService`, `LeaveService`) encapsulate complex database & business logic away from Controllers.

### Q2: How does JWT Authentication work in Spring Security?
1. Client sends POST request to `/api/auth/login` with username & password.
2. `AuthenticationManager` verifies credentials using BCrypt password encoder.
3. Upon success, `JwtUtils` generates a signed JWT token containing claims & expiration.
4. Client attaches `Authorization: Bearer <JWT>` header in subsequent requests.
5. `AuthTokenFilter` intercepts requests, parses JWT, loads `UserDetails`, and populates `SecurityContextHolder`.

### Q3: How is late attendance detected automatically?
In `BiometricService.java`, the system compares the current system time (`LocalTime.now()`) with the configured session start threshold (09:15 AM). If the scan timestamp is after 09:15 AM, the attendance status is automatically assigned as `LATE` instead of `PRESENT`.

### Q4: How is duplicate biometric attendance prevented?
Before saving an `AttendanceRecord`, `AttendanceRecordRepository.findBySessionIdAndStudentId(sessionId, studentId)` queries existing records for today's session. If a match exists, `AttendanceAlreadyMarkedException` is thrown (or logged as `DUPLICATE`), preventing duplicate entry insertion.

### Q5: How is overall attendance percentage calculated?
Formula:
$$\text{Attendance Percentage} = \frac{\text{Present Classes} + \text{Late Classes}}{\text{Total Conducted Classes}} \times 100$$
If percentage $< 75\%$, a Low Attendance Warning banner is rendered. If $< 65\%$, a Critical Attendance Warning is triggered.

### Q6: How does Global Exception Handling work?
`GlobalExceptionHandler.java` is annotated with `@RestControllerAdvice`. It catches custom exceptions such as `ResourceNotFoundException`, `AttendanceAlreadyMarkedException`, `StudentNotFoundException`, and `BadCredentialsException`, returning uniform HTTP JSON error responses with status codes (`404`, `409`, `401`, `400`).
