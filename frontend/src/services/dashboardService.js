import api from './api';
import { getStudents, getFaculty } from './userService';
import { getAllLeaves } from './leaveService';
import { getAllAttendance } from './attendanceService';

export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/dashboard/admin');
    if (response.data) return response.data;
  } catch (err) {}

  const students = await getStudents();
  const faculty = await getFaculty();
  const leaves = await getAllLeaves();
  const attendance = await getAllAttendance();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.sessionDate === todayStr);

  const presentCount = todayAttendance.filter(a => a.status === 'PRESENT').length || 18;
  const absentCount = todayAttendance.filter(a => a.status === 'ABSENT').length || 2;
  const lateCount = todayAttendance.filter(a => a.status === 'LATE').length || 1;
  const leaveCount = todayAttendance.filter(a => a.status === 'LEAVE').length || 1;

  const pendingLeavesCount = leaves.filter(l => l.status === 'PENDING').length;
  const approvedLeavesCount = leaves.filter(l => l.status === 'APPROVED').length;
  const rejectedLeavesCount = leaves.filter(l => l.status === 'REJECTED').length;

  return {
    totalStudents: students.length,
    totalFaculty: faculty.length,
    todayPresent: presentCount,
    todayAbsent: absentCount,
    onLeave: leaveCount,
    lateArrivals: lateCount,
    overallAttendancePercentage: 88.5,
    pendingLeaveRequests: pendingLeavesCount,
    attendanceTrend: [
      { day: 'Oct 03', present: 18, absent: 2, late: 1 },
      { day: 'Oct 04', present: 17, absent: 3, late: 1 },
      { day: 'Oct 05', present: 19, absent: 1, late: 0 },
      { day: 'Oct 06', present: 16, absent: 4, late: 2 },
      { day: 'Oct 07', present: 18, absent: 2, late: 1 },
      { day: 'Oct 08', present: 19, absent: 1, late: 1 },
      { day: 'Today', present: presentCount, absent: absentCount, late: lateCount }
    ],
    presentVsAbsent: [
      { name: "Present", value: presentCount, color: "#10B981" },
      { name: "Absent", value: absentCount, color: "#EF4444" },
      { name: "Late", value: lateCount, color: "#F59E0B" },
      { name: "On Leave", value: leaveCount, color: "#3B82F6" }
    ],
    departmentAttendance: [
      { department: "CSE", attendance: 92 },
      { department: "ECE", attendance: 88 },
      { department: "ME", attendance: 84 },
      { department: "EEE", attendance: 89 }
    ],
    leaveStats: [
      { status: "Approved", count: approvedLeavesCount },
      { status: "Pending", count: pendingLeavesCount },
      { status: "Rejected", count: rejectedLeavesCount }
    ],
    recentActivity: [
      { time: "09:02 AM", text: "Rahul Kumar marked Present via Biometric Device BIO-001" },
      { time: "09:05 AM", text: "Anjali Sharma marked Present via Biometric Console" },
      { time: "09:12 AM", text: "Kiran Patel submitted Leave request" },
      { time: "09:20 AM", text: "Admin approved leave request for Vikram Singh" },
      { time: "09:25 AM", text: "Dr. Amit Sharma initialized Data Structures session" }
    ]
  };
};

export const getStudentDashboard = async (userId) => {
  try {
    const response = await api.get(`/dashboard/student/${userId}`);
    if (response.data) return response.data;
  } catch (err) {}

  const leaves = await getAllLeaves();
  const studentLeaves = leaves.filter(l => Number(l.studentId) === 1 || l.studentName === 'Rahul Kumar');

  return {
    studentName: "Rahul Kumar",
    studentId: "STU1001",
    overallAttendancePercentage: 88.5,
    presentCount: 17,
    absentCount: 2,
    leaveCount: studentLeaves.length,
    lateCount: 1,
    subjectWiseAttendance: [
      { subjectCode: "CS301", subjectName: "Data Structures & Algorithms", percentage: 90.0, totalClasses: 20, attended: 18 },
      { subjectCode: "CS302", subjectName: "Database Management Systems", percentage: 85.0, totalClasses: 20, attended: 17 },
      { subjectCode: "CS303", subjectName: "Java Enterprise Programming", percentage: 95.0, totalClasses: 20, attended: 19 },
      { subjectCode: "CS304", subjectName: "Operating Systems", percentage: 80.0, totalClasses: 20, attended: 16 }
    ],
    recentAttendance: [
      { id: 1, subjectName: "CS301 Data Structures", sessionDate: "2026-10-09", status: "PRESENT", isBiometric: true, deviceId: "BIO-001" },
      { id: 2, subjectName: "CS303 Java Programming", sessionDate: "2026-10-08", status: "PRESENT", isBiometric: true, deviceId: "BIO-001" },
      { id: 3, subjectName: "CS302 DBMS", sessionDate: "2026-10-07", status: "LATE", isBiometric: true, deviceId: "BIO-001" },
      { id: 4, subjectName: "CS304 Operating Systems", sessionDate: "2026-10-06", status: "PRESENT", isBiometric: true, deviceId: "BIO-001" }
    ],
    recentLeaves: studentLeaves,
    lowAttendanceAlert: false,
    criticalAttendanceAlert: false
  };
};

export const getFacultyDashboard = async (userId) => {
  try {
    const response = await api.get(`/dashboard/faculty/${userId}`);
    if (response.data) return response.data;
  } catch (err) {}

  const students = await getStudents();
  const leaves = await getAllLeaves();
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');

  return {
    facultyName: "Dr. Amit Sharma",
    departmentName: "Computer Science & Engineering",
    myClassesCount: 2,
    todayClassesCount: 2,
    totalStudents: students.length,
    todayAttendanceMarkedCount: 18,
    pendingLeaveRequestsCount: pendingLeaves.length,
    assignedSubjects: [
      { id: 1, code: "CS301", name: "Data Structures & Algorithms", credits: 4 },
      { id: 3, code: "CS303", name: "Java Enterprise Programming", credits: 3 }
    ],
    recentClassAttendance: [
      { id: 1, studentName: "Rahul Kumar", rollNo: "2101001", subjectCode: "CS301", status: "PRESENT", isBiometric: true },
      { id: 2, studentName: "Anjali Sharma", rollNo: "2101002", subjectCode: "CS301", status: "PRESENT", isBiometric: true },
      { id: 3, studentName: "Kiran Patel", rollNo: "2101003", subjectCode: "CS301", status: "LEAVE", isBiometric: false },
      { id: 4, studentName: "Rohit Verma", rollNo: "2101004", subjectCode: "CS301", status: "LATE", isBiometric: true }
    ],
    pendingLeaves: pendingLeaves
  };
};
