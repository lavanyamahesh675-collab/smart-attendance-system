import api from './api';

const initialLeaves = [
  { id: 1, studentId: 1, studentCustomId: "STU1001", studentName: "Rahul Kumar", departmentName: "CSE", leaveType: "MEDICAL", startDate: "2026-10-04", endDate: "2026-10-05", numberOfDays: 2, reason: "Severe fever and rest", status: "APPROVED", reviewerRemarks: "Approved. Medical verified." },
  { id: 2, studentId: 3, studentCustomId: "STU1003", studentName: "Kiran Patel", departmentName: "CSE", leaveType: "PERSONAL", startDate: "2026-10-09", endDate: "2026-10-10", numberOfDays: 2, reason: "Attending sister's wedding", status: "PENDING" }
];

const getStoredLeaves = () => {
  const stored = localStorage.getItem('bioattend_leaves');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('bioattend_leaves', JSON.stringify(initialLeaves));
  return initialLeaves;
};

const saveStoredLeaves = (leaves) => {
  localStorage.setItem('bioattend_leaves', JSON.stringify(leaves));
};

export const getAllLeaves = async () => {
  try {
    const response = await api.get('/leaves');
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  return getStoredLeaves();
};

export const getStudentLeaves = async (studentId) => {
  try {
    const response = await api.get(`/leaves/student/${studentId}`);
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  const leaves = getStoredLeaves();
  return leaves.filter(l => Number(l.studentId) === Number(studentId));
};

export const getPendingLeaves = async () => {
  try {
    const response = await api.get('/leaves/pending');
    if (response.data && response.data.length > 0) return response.data;
  } catch (err) {}
  const leaves = getStoredLeaves();
  return leaves.filter(l => l.status === 'PENDING');
};

export const applyLeave = async (studentId, data) => {
  const currentLeaves = getStoredLeaves();
  const newLeave = {
    id: Date.now(),
    studentId: Number(studentId),
    studentCustomId: data.studentCustomId || "STU1001",
    studentName: data.studentName || "Rahul Kumar",
    departmentName: data.departmentName || "CSE",
    leaveType: data.leaveType || "PERSONAL",
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    endDate: data.endDate || new Date().toISOString().split('T')[0],
    numberOfDays: Number(data.numberOfDays || 1),
    reason: data.reason || "Personal leave request",
    status: "PENDING"
  };

  try {
    await api.post(`/leaves/student/${studentId}`, data);
  } catch (err) {}

  const updated = [newLeave, ...currentLeaves];
  saveStoredLeaves(updated);
  return newLeave;
};

export const approveLeave = async (leaveId, remarks = '') => {
  const currentLeaves = getStoredLeaves();
  const updated = currentLeaves.map(l => {
    if (l.id === Number(leaveId)) {
      return { ...l, status: "APPROVED", reviewerRemarks: remarks };
    }
    return l;
  });
  saveStoredLeaves(updated);

  try {
    await api.put(`/leaves/${leaveId}/approve`, { status: 'APPROVED', remarks });
  } catch (err) {}

  return updated.find(l => l.id === Number(leaveId));
};

export const rejectLeave = async (leaveId, remarks = '') => {
  const currentLeaves = getStoredLeaves();
  const updated = currentLeaves.map(l => {
    if (l.id === Number(leaveId)) {
      return { ...l, status: "REJECTED", reviewerRemarks: remarks };
    }
    return l;
  });
  saveStoredLeaves(updated);

  try {
    await api.put(`/leaves/${leaveId}/reject`, { status: 'REJECTED', remarks });
  } catch (err) {}

  return updated.find(l => l.id === Number(leaveId));
};
