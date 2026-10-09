import api from './api';

const initialAttendance = [
  { id: 1, studentId: 1, studentCustomId: "STU1001", studentName: "Rahul Kumar", rollNo: "2101001", subjectName: "CS301 Data Structures", sessionDate: new Date().toISOString().split('T')[0], status: "PRESENT", isBiometric: true, deviceId: "BIO-001" },
  { id: 2, studentId: 2, studentCustomId: "STU1002", studentName: "Anjali Sharma", rollNo: "2101002", subjectName: "CS301 Data Structures", sessionDate: new Date().toISOString().split('T')[0], status: "PRESENT", isBiometric: true, deviceId: "BIO-001" },
  { id: 3, studentId: 3, studentCustomId: "STU1003", studentName: "Kiran Patel", rollNo: "2101003", subjectName: "CS301 Data Structures", sessionDate: new Date().toISOString().split('T')[0], status: "LEAVE", isBiometric: false },
  { id: 4, studentId: 4, studentCustomId: "STU1004", studentName: "Rohit Verma", rollNo: "2101004", subjectName: "CS301 Data Structures", sessionDate: new Date().toISOString().split('T')[0], status: "LATE", isBiometric: true, deviceId: "BIO-001" }
];

const getStoredAttendance = () => {
  const stored = localStorage.getItem('bioattend_attendance');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('bioattend_attendance', JSON.stringify(initialAttendance));
  return initialAttendance;
};

const saveStoredAttendance = (records) => {
  localStorage.setItem('bioattend_attendance', JSON.stringify(records));
};

export const getAllAttendance = async () => {
  try {
    const response = await api.get('/attendance');
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  return getStoredAttendance();
};

export const getStudentAttendance = async (studentId) => {
  try {
    const response = await api.get(`/attendance/student/${studentId}`);
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  const records = getStoredAttendance();
  return records.filter(r => Number(r.studentId) === Number(studentId));
};

export const getAttendanceByDate = async (dateStr) => {
  try {
    const response = await api.get(`/attendance/date/${dateStr}`);
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  const records = getStoredAttendance();
  return records.filter(r => r.sessionDate === dateStr);
};

export const markAttendance = async (data) => {
  const records = getStoredAttendance();
  const newRecord = { id: Date.now(), ...data, sessionDate: data.sessionDate || new Date().toISOString().split('T')[0] };
  const updated = [newRecord, ...records];
  saveStoredAttendance(updated);

  try {
    await api.post('/attendance', data);
  } catch (err) {}
  return newRecord;
};

export const updateAttendance = async (recordId, status, remarks) => {
  const records = getStoredAttendance();
  const updated = records.map(r => {
    if (r.id === Number(recordId)) {
      return { ...r, status, remarks };
    }
    return r;
  });
  saveStoredAttendance(updated);

  try {
    await api.put(`/attendance/${recordId}`, null, { params: { status, remarks } });
  } catch (err) {}
  return updated.find(r => r.id === Number(recordId));
};
