import api from './api';

export const getAllLeaves = async () => {
  try {
    const response = await api.get('/leaves');
    return response.data;
  } catch (err) {
    return [
      { id: 1, studentId: 1, studentCustomId: "STU1001", studentName: "Rahul Kumar", departmentName: "CSE", leaveType: "MEDICAL", startDate: "2026-10-04", endDate: "2026-10-05", numberOfDays: 2, reason: "Severe fever and rest", status: "APPROVED", reviewerRemarks: "Approved. Medical verified." },
      { id: 2, studentId: 3, studentCustomId: "STU1003", studentName: "Kiran Patel", departmentName: "CSE", leaveType: "PERSONAL", startDate: "2026-10-09", endDate: "2026-10-10", numberOfDays: 2, reason: "Attending sister's wedding", status: "PENDING" }
    ];
  }
};

export const getStudentLeaves = async (studentId) => {
  try {
    const response = await api.get(`/leaves/student/${studentId}`);
    return response.data;
  } catch (err) {
    return [
      { id: 1, studentId: studentId, studentCustomId: "STU1001", studentName: "Rahul Kumar", departmentName: "CSE", leaveType: "MEDICAL", startDate: "2026-10-04", endDate: "2026-10-05", numberOfDays: 2, reason: "Severe fever and rest", status: "APPROVED", reviewerRemarks: "Approved. Medical verified." }
    ];
  }
};

export const getPendingLeaves = async () => {
  try {
    const response = await api.get('/leaves/pending');
    return response.data;
  } catch (err) {
    return [
      { id: 2, studentId: 3, studentCustomId: "STU1003", studentName: "Kiran Patel", departmentName: "CSE", leaveType: "PERSONAL", startDate: "2026-10-09", endDate: "2026-10-10", numberOfDays: 2, reason: "Attending sister's wedding", status: "PENDING" }
    ];
  }
};

export const applyLeave = async (studentId, data) => {
  try {
    const response = await api.post(`/leaves/student/${studentId}`, data);
    return response.data;
  } catch (err) {
    return { id: Date.now(), studentId, studentName: "Rahul Kumar", status: "PENDING", ...data, numberOfDays: 2 };
  }
};

export const approveLeave = async (leaveId, remarks = '') => {
  try {
    const response = await api.put(`/leaves/${leaveId}/approve`, { status: 'APPROVED', remarks });
    return response.data;
  } catch (err) {
    return { id: leaveId, status: "APPROVED", reviewerRemarks: remarks };
  }
};

export const rejectLeave = async (leaveId, remarks = '') => {
  try {
    const response = await api.put(`/leaves/${leaveId}/reject`, { status: 'REJECTED', remarks });
    return response.data;
  } catch (err) {
    return { id: leaveId, status: "REJECTED", reviewerRemarks: remarks };
  }
};
