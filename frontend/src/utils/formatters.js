export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  if (timeStr.includes('T')) {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  return timeStr;
};

export const getAttendanceColorClass = (pct) => {
  if (pct >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (pct >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (pct >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-rose-600 bg-rose-50 border-rose-200';
};
