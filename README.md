# BioAttend — Smart Biometric Attendance & Leave Management System

> **Tagline:** *"Smarter Attendance. Simpler Management."*  
> **Project Type:** Full-Stack BTech Java Lab Project  
> **Tech Stack:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL / H2, Maven, React.js, Tailwind CSS, Recharts.

---

## 📌 1. Project Overview

**BioAttend** is a full-stack Java BTech Lab project designed as an enterprise college & organization management application. It automates student attendance tracking, biometric hardware verification simulation, leave management workflows, low-attendance alerts (<75%), and multi-role dashboard analytics.

---

## 🔑 2. Demo Credentials

The application is pre-seeded with sample data and demo accounts for testing out-of-the-box:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `Admin@123` | Full System Management, Reports, Users, Departments, Biometric Devices |
| **FACULTY** | `faculty` | `Faculty@123` | Class Attendance, Student Search, Review Leaves, Subject Reports |
| **STUDENT** | `student` | `Student@123` | Personal Attendance %, Subject Breakdown, Apply Leave, Calendar |

---

## 🚀 3. Key Features

1. **Biometric Attendance Simulation:**
   - Simulated optical fingerprint reader console (`BIO-001`).
   - Automated 1:N fingerprint hash matching.
   - **Late Detection:** Automatic marking of `LATE` status if scanned after 09:15 AM.
   - **Duplicate Prevention:** Blocks duplicate check-ins for the same student & session.
2. **Attendance Management:**
   - Statuses: `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `LEAVE`.
   - Percentage calculation: `(Present + Late) / Total Conducted * 100`.
   - Visual alerts for Low Attendance (<75%) and Critical Attendance (<65%).
3. **Leave Management Workflow:**
   - Student leave application (`Medical`, `Personal`, `Emergency`, `Academic`, `Other`).
   - Approval & rejection by Authorized Faculty / Admin with reviewer remarks.
   - In-app notification triggers on status update.
4. **Role-Based Dashboards & Recharts Analytics:**
   - Admin overview charts (Line chart trends, Donut status, Department bar graph, Activity stream).
   - Student dashboard with circular progress ring & subject breakdown.
   - Faculty dashboard with quick actions and assigned subjects.
5. **Interactive Attendance Calendar:**
   - Color-coded day cards (`✓ Present`, `✕ Absent`, `⏰ Late`, `L Leave`).
   - Click date to open modal detailing session attendance.
6. **Reports & Exports:**
   - Export reports as CSV.
   - Printable HTML report layout.

---

## 🏗 4. Architecture

```text
              USER / BROWSER
                    |
                    ↓
         React.js Frontend (Vite + Tailwind)
                    |
           REST API (JSON over HTTP)
                    |
                    ↓
      Spring Boot Backend (Java 17, Maven)
                    |
      +-------------+-------------+
      |                           |
 Spring Security (JWT)    Spring Data JPA
                                  |
                                  ↓
                        MySQL / H2 Database
```

---

## 🛠 5. How to Run the Project

### Prerequisites
- JDK 17 or higher
- Node.js (v18 or higher) & NPM

### Step A: Running the Spring Boot Backend
1. Open terminal in `smart-attendance-system/backend`
2. Run:
   ```bash
   mvn spring-boot:run
   ```
   *(Backend starts on `http://localhost:8080`, H2 console at `http://localhost:8080/h2-console`)*

### Step B: Running the React Frontend
1. Open terminal in `smart-attendance-system/frontend`
2. Install dependencies & start dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Open browser at `http://localhost:5173`

---

## 🗄 6. MySQL Database Configuration (Optional)

By default, the application runs on embedded H2 for instant demo setup. To connect MySQL:
1. Create a MySQL database: `CREATE DATABASE bioattend_db;`
2. Open `backend/src/main/resources/application.properties`
3. Update database configuration or activate the `mysql` profile:
   ```properties
   spring.profiles.active=mysql
   ```

---

## 🎓 7. Lab Viva Guide

Refer to `docs/viva-questions.md` for complete viva Q&A covering Java OOP concepts, Spring Security JWT filters, JPA relationships, and REST API conventions used in this project.
