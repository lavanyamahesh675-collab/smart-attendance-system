export const APP_NAME = "BioAttend";
export const TAGLINE = "Smarter Attendance. Simpler Management.";

export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  FACULTY: "ROLE_FACULTY",
  STUDENT: "ROLE_STUDENT",
};

export const ATTENDANCE_STATUS = {
  PRESENT: { label: "Present", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "✓" },
  ABSENT: { label: "Absent", color: "bg-rose-100 text-rose-700 border-rose-200", icon: "✕" },
  LATE: { label: "Late", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "⏰" },
  HALF_DAY: { label: "Half Day", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "½" },
  LEAVE: { label: "Leave", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "L" },
};

export const LEAVE_STATUS = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  APPROVED: { label: "Approved", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  REJECTED: { label: "Rejected", color: "bg-rose-100 text-rose-800 border-rose-200" },
  CANCELLED: { label: "Cancelled", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

export const LEAVE_TYPES = [
  "MEDICAL",
  "PERSONAL",
  "EMERGENCY",
  "ACADEMIC",
  "OTHER"
];
