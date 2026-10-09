# System Architecture Document — BioAttend

## Overview
BioAttend follows a 3-Tier Layered Architecture with decoupled Frontend (Single Page Application) and Backend (REST API Service).

```text
+-------------------------------------------------------------------+
|                        REACT FRONTEND                             |
|  - React Router (Role Routes)                                     |
|  - Context API (AuthContext, NotificationContext)                 |
|  - Axios Interceptors (JWT Bearer Token Injection)                |
|  - Recharts & Tailwind CSS Components                             |
+-------------------------------------------------------------------+
                                 |  REST / HTTP (JSON)
                                 v
+-------------------------------------------------------------------+
|                      SPRING BOOT BACKEND                          |
|                                                                   |
|  [ Controllers Layer ]  - Auth, Student, Faculty, Attendance,     |
|                           Biometric, Leave, Dashboard, Reports    |
|                                                                   |
|  [ Security Filter ]   - AuthTokenFilter (JWT Extraction & Val)   |
|                                                                   |
|  [ Service Layer ]     - Business Logic, Late Rules, Duplicate    |
|                           Checks, Attendance % Calculation        |
|                                                                   |
|  [ Repository Layer ]  - Spring Data JPA Interfaces               |
+-------------------------------------------------------------------+
                                 |  JPA / JDBC
                                 v
+-------------------------------------------------------------------+
|                         DATABASE LAYER                            |
|  - MySQL Database (bioattend_db) / H2 In-Memory DB                |
+-------------------------------------------------------------------+
```

## Security & Authentication Flow
1. User submits credentials at `/api/auth/login`.
2. `AuthenticationManager` authenticates user via `UserDetailsServiceImpl`.
3. `JwtUtils` generates signed HMAC-SHA256 JWT Token containing username and expiration.
4. Client stores JWT in `localStorage` and includes header `Authorization: Bearer <token>` on all requests.
5. `AuthTokenFilter` validates token signature and populates Spring `SecurityContextHolder`.
