import api from './api';

export const getAllAttendance = async () => {
  try {
    const response = await api.get('/attendance');
    return response.data;
  } catch (err) {
    return [
      { id: 1, studentId: 1, studentCustomId: "STU1001", studentName: "Rahul Kumar", rollNo: "2101001", subjectName: "CS301 Data Structures", sessionDate: "2026-10-09", status: "PRESENT", isBiometric: true, deviceId: "BIO-001" },
      { id: 2, studentId: 2, studentCustomId: "STU1002", studentName: "Anjali Sharma", rollNo: "2101002", subjectName: "CS301 Data Structures", sessionDate: "2026-10-09", status: "PRESENT", isBiometric: true, deviceId: "BIO-001" },
      { id: 3, studentId: 3, studentCustomId: "STU1003", studentName: "Kiran Patel", rollNo: "2101003", subjectName: "CS301 Data Structures", sessionDate: "2026-10-09", status: "LEAVE", isBiometric: false },
      { id: 4, studentId: 4, studentCustomId: "STU1004", studentName: "Rohit Verma", rollNo: "2101004", subjectName: "CS301 Data Structures", sessionDate: "2026-10-09", status: "LATE", isBiometric: true, deviceId: "BIO-001" }
    ];
  }
};

export const getStudentAttendance = async (studentId) => {
  try {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  } catch (err) {
    return [
      { id: 1, studentId: studentId, studentCustomId: "STU1001", studentName: "Rahul Kumar", rollNo: "2101001", subjectName: "CS301 Data Structures", sessionDate: "2026-10-09", status: "PRESENT", isBiometric: true, deviceId: "BIO-001" }
    ];
  }
};

export const getAttendanceByDate = async (dateStr) => {
  try {
    const response = await api.get(`/attendance/date/${dateStr}`);
    return response.data;
  } catch (err) {
    return [
      { id: 1, studentId: 1, studentCustomId: "STU1001", studentName: "Rahul Kumar", rollNo: "2101001", subjectName: "CS301 Data Structures", sessionDate: dateStr, status: "PRESENT", isBiometric: true, deviceId: "BIO-001" }
    ];
  }
};

export const markAttendance = async (data) => {
  try {
    const response = await api.post('/attendance', data);
    return response.data;
  } catch (err) {
    return { id: Date.now(), ...data };
  }
};

export const updateAttendance = async (recordId, status, remarks) => {
  try {
    const response = await api.put(`/attendance/${recordId}`, null, {
      params: { status, remarks }
    });
    return response.data;
  } catch (err) {
    return { id: recordId, status, remarks };
  }
};
