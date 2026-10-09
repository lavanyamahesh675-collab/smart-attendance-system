package com.attendance.config;

import com.attendance.entity.*;
import com.attendance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private AttendanceSessionRepository sessionRepository;

    @Autowired
    private AttendanceRecordRepository recordRepository;

    @Autowired
    private LeaveRequestRepository leaveRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BiometricDeviceRepository deviceRepository;

    @Autowired
    private BiometricLogRepository logRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("=================================================");
        System.out.println("🚀 Initializing BioAttend Demo Data (30+ Students)...");
        System.out.println("=================================================");

        // 1. Create Departments
        Department cse = departmentRepository.save(Department.builder().code("CSE").name("Computer Science & Engineering").description("Department of CSE").build());
        Department ece = departmentRepository.save(Department.builder().code("ECE").name("Electronics & Communication Eng.").description("Department of ECE").build());
        Department me = departmentRepository.save(Department.builder().code("ME").name("Mechanical Engineering").description("Department of ME").build());
        Department eee = departmentRepository.save(Department.builder().code("EEE").name("Electrical & Electronics Eng.").description("Department of EEE").build());

        // 2. Create Courses
        Course btechCse = courseRepository.save(Course.builder().code("BTECH-CSE").name("B.Tech Computer Science").department(cse).build());
        Course btechEce = courseRepository.save(Course.builder().code("BTECH-ECE").name("B.Tech Electronics").department(ece).build());
        Course btechMe = courseRepository.save(Course.builder().code("BTECH-ME").name("B.Tech Mechanical").department(me).build());
        Course btechEee = courseRepository.save(Course.builder().code("BTECH-EEE").name("B.Tech Electrical").department(eee).build());

        // 3. Create Admin User
        userRepository.save(User.builder()
                .username("admin")
                .email("admin@bioattend.edu")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("System Administrator")
                .phone("+91 98765 43210")
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=AdminSystem")
                .role(Role.ROLE_ADMIN)
                .active(true)
                .build());

        // 4. Create Faculty Members
        String[][] facultyInfo = {
                {"faculty", "faculty@bioattend.edu", "Dr. Amit Sharma", "Professor & HOD", "EMP1001", "CSE"},
                {"fac_priya", "priya@bioattend.edu", "Dr. Priya Varma", "Associate Professor", "EMP1002", "CSE"},
                {"fac_rajesh", "rajesh@bioattend.edu", "Prof. Rajesh Kumar", "Assistant Professor", "EMP1003", "ECE"},
                {"fac_sunita", "sunita@bioattend.edu", "Dr. Sunita Rao", "Associate Professor", "EMP1004", "ME"},
                {"fac_vikram", "vikram@bioattend.edu", "Prof. Vikram Reddy", "Assistant Professor", "EMP1005", "EEE"}
        };

        List<Faculty> facultyList = new ArrayList<>();
        for (int i = 0; i < facultyInfo.length; i++) {
            User fUser = userRepository.save(User.builder()
                    .username(facultyInfo[i][0])
                    .email(facultyInfo[i][1])
                    .password(passwordEncoder.encode("Faculty@123"))
                    .fullName(facultyInfo[i][2])
                    .phone("+91 98765 0000" + (i + 1))
                    .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + facultyInfo[i][4])
                    .role(Role.ROLE_FACULTY)
                    .active(true)
                    .build());

            Department d = facultyInfo[i][5].equals("CSE") ? cse :
                    facultyInfo[i][5].equals("ECE") ? ece :
                    facultyInfo[i][5].equals("ME") ? me : eee;

            Faculty f = facultyRepository.save(Faculty.builder()
                    .user(fUser)
                    .employeeId(facultyInfo[i][4])
                    .department(d)
                    .designation(facultyInfo[i][3])
                    .joinDate(LocalDate.of(2020, 8, 15))
                    .build());
            facultyList.add(f);
        }

        Faculty demoFaculty = facultyList.get(0);

        // 5. Create Subjects
        Subject sub1 = subjectRepository.save(Subject.builder().code("CS301").name("Data Structures & Algorithms").credits(4).course(btechCse).faculty(facultyList.get(0)).build());
        Subject sub2 = subjectRepository.save(Subject.builder().code("CS302").name("Database Management Systems").credits(4).course(btechCse).faculty(facultyList.get(1)).build());
        Subject sub3 = subjectRepository.save(Subject.builder().code("CS303").name("Java Enterprise Programming").credits(3).course(btechCse).faculty(facultyList.get(0)).build());
        Subject sub4 = subjectRepository.save(Subject.builder().code("CS304").name("Operating Systems").credits(4).course(btechCse).faculty(facultyList.get(1)).build());
        subjectRepository.save(Subject.builder().code("EC301").name("Digital Signal Processing").credits(4).course(btechEce).faculty(facultyList.get(2)).build());
        subjectRepository.save(Subject.builder().code("EC302").name("Microcontrollers & Embedded Systems").credits(3).course(btechEce).faculty(facultyList.get(2)).build());
        subjectRepository.save(Subject.builder().code("ME301").name("Thermodynamics & Heat Transfer").credits(4).course(btechMe).faculty(facultyList.get(3)).build());
        subjectRepository.save(Subject.builder().code("EE301").name("Control Systems & Circuit Theory").credits(4).course(btechEee).faculty(facultyList.get(4)).build());

        // 6. Create 30 Students
        String[][] studentData = {
                {"student", "Rahul Kumar", "STU1001", "2101001", "CSE"},
                {"stu_anjali", "Anjali Sharma", "STU1002", "2101002", "CSE"},
                {"stu_kiran", "Kiran Patel", "STU1003", "2101003", "CSE"},
                {"stu_rohit", "Rohit Verma", "STU1004", "2101004", "CSE"},
                {"stu_sneha", "Sneha Gupta", "STU1005", "2101005", "CSE"},
                {"stu_aditya", "Aditya Singh", "STU1006", "2101006", "CSE"},
                {"stu_pooja", "Pooja Hegde", "STU1007", "2101007", "CSE"},
                {"stu_varun", "Varun Dhawan", "STU1008", "2101008", "CSE"},
                {"stu_kavya", "Kavya Nair", "STU1009", "2101009", "CSE"},
                {"stu_manish", "Manish Pandey", "STU1010", "2101010", "CSE"},
                {"stu_neha", "Neha Mehta", "STU1011", "2102001", "ECE"},
                {"stu_siddharth", "Siddharth Roy", "STU1012", "2102002", "ECE"},
                {"stu_ishita", "Ishita Dutta", "STU1013", "2102003", "ECE"},
                {"stu_gautam", "Gautam Gambhir", "STU1014", "2102004", "ECE"},
                {"stu_divya", "Divya Spandana", "STU1015", "2102005", "ECE"},
                {"stu_aakash", "Aakash Chopra", "STU1016", "2102006", "ECE"},
                {"stu_tushar", "Tushar Deshmukh", "STU1017", "2103001", "ME"},
                {"stu_ananya", "Ananya Panday", "STU1018", "2103002", "ME"},
                {"stu_harsh", "Harsh Vardhan", "STU1019", "2103003", "ME"},
                {"stu_kunal", "Kunal Kapoor", "STU1020", "2103004", "ME"},
                {"stu_preeti", "Preeti Zinta", "STU1021", "2103005", "ME"},
                {"stu_ritika", "Ritika Singh", "STU1022", "2104001", "EEE"},
                {"stu_yash", "Yash Gowda", "STU1023", "2104002", "EEE"},
                {"stu_suresh", "Suresh Raina", "STU1024", "2104003", "EEE"},
                {"stu_tara", "Tara Sutaria", "STU1025", "2104004", "EEE"},
                {"stu_vijay", "Vijay Devarakonda", "STU1026", "2104005", "EEE"},
                {"stu_deepika", "Deepika Padukone", "STU1027", "2101011", "CSE"},
                {"stu_ranveer", "Ranveer Singh", "STU1028", "2101012", "CSE"},
                {"stu_kriti", "Kriti Sanon", "STU1029", "2102007", "ECE"},
                {"stu_kartik", "Kartik Aaryan", "STU1030", "2103006", "ME"}
        };

        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < studentData.length; i++) {
            User sUser = userRepository.save(User.builder()
                    .username(studentData[i][0])
                    .email(studentData[i][0] + "@bioattend.edu")
                    .password(passwordEncoder.encode("Student@123"))
                    .fullName(studentData[i][1])
                    .phone("+91 99887 11" + (i < 10 ? "0" + i : i))
                    .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + studentData[i][2])
                    .role(Role.ROLE_STUDENT)
                    .active(true)
                    .build());

            Department d = studentData[i][4].equals("CSE") ? cse :
                    studentData[i][4].equals("ECE") ? ece :
                    studentData[i][4].equals("ME") ? me : eee;
            Course c = studentData[i][4].equals("CSE") ? btechCse :
                    studentData[i][4].equals("ECE") ? btechEce :
                    studentData[i][4].equals("ME") ? btechMe : btechEee;

            Student s = studentRepository.save(Student.builder()
                    .user(sUser)
                    .studentId(studentData[i][2])
                    .rollNo(studentData[i][3])
                    .department(d)
                    .course(c)
                    .semester(6)
                    .batch("2023-2027")
                    .biometricRegistered(true)
                    .fingerprintHash("BIO_HASH_" + studentData[i][2])
                    .build());
            studentList.add(s);
        }

        Student demoStudent = studentList.get(0);

        // 7. Create Biometric Devices
        BiometricDevice dev1 = deviceRepository.save(BiometricDevice.builder()
                .deviceCode("BIO-001")
                .deviceName("Main Gate Terminal")
                .location("Academic Block A")
                .ipAddress("192.168.1.101")
                .status("ONLINE")
                .lastPing(LocalDateTime.now())
                .build());

        // 8. Generate Attendance Records across dates
        LocalDate today = LocalDate.now();
        for (int dayOffset = 5; dayOffset >= 0; dayOffset--) {
            LocalDate date = today.minusDays(dayOffset);
            
            AttendanceSession s1 = sessionRepository.save(AttendanceSession.builder()
                    .subject(sub1)
                    .faculty(demoFaculty)
                    .sessionDate(date)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(10, 0))
                    .roomNo("Lab 3")
                    .status("COMPLETED")
                    .build());

            for (int sIdx = 0; sIdx < 15; sIdx++) {
                Student st = studentList.get(sIdx);
                AttendanceStatus status = (sIdx % 6 == 0) ? AttendanceStatus.ABSENT :
                        (sIdx % 5 == 0) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

                recordRepository.save(AttendanceRecord.builder()
                        .session(s1)
                        .student(st)
                        .status(status)
                        .markedTime(LocalDateTime.of(date, LocalTime.of(8, 55)))
                        .isBiometric(true)
                        .deviceId("BIO-001")
                        .remarks("Biometric terminal check-in")
                        .build());
            }
        }

        // 9. Leave Request
        leaveRepository.save(LeaveRequest.builder()
                .student(demoStudent)
                .leaveType(LeaveType.MEDICAL)
                .startDate(today.minusDays(2))
                .endDate(today.minusDays(1))
                .numberOfDays(2)
                .reason("Severe fever and doctor recommended rest.")
                .status(LeaveStatus.APPROVED)
                .reviewerRemarks("Approved. Medical verified.")
                .reviewedBy("Dr. Amit Sharma")
                .reviewedAt(LocalDateTime.now().minusDays(2))
                .build());

        // 10. Notification
        notificationRepository.save(Notification.builder()
                .user(demoStudent.getUser())
                .title("✓ Leave Request Approved")
                .message("Your Medical Leave request for 2 days has been approved by Dr. Amit Sharma.")
                .type("SUCCESS")
                .isRead(false)
                .build());

        System.out.println("✅ BioAttend Seeding Complete with 30 Students!");
    }
}
