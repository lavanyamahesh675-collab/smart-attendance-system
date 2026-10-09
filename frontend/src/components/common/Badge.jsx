import React from 'react';
import { ATTENDANCE_STATUS, LEAVE_STATUS } from '../../utils/constants';

export default function Badge({ status, type = 'attendance' }) {
  if (type === 'attendance') {
    const config = ATTENDANCE_STATUS[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: '•' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  }

  const config = LEAVE_STATUS[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  );
}
