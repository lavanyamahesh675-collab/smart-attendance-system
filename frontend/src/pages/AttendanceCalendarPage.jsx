import React, { useState, useEffect } from 'react';
import { getAllAttendance } from '../services/attendanceService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

export default function AttendanceCalendarPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    getAllAttendance()
      .then(res => setRecords(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading Attendance Calendar..." />;

  // Generate Calendar Days for Current Month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create date lookup map: "YYYY-MM-DD" -> records array
  const dateMap = {};
  records.forEach((r) => {
    if (r.sessionDate) {
      if (!dateMap[r.sessionDate]) dateMap[r.sessionDate] = [];
      dateMap[r.sessionDate].push(r);
    }
  });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNum) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayRecords = dateMap[formattedDate] || [];
    setSelectedDate({ dateStr: formattedDate, records: dayRecords });
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-indigo-600" />
            <span>Interactive Attendance Calendar</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual status indicators for Present, Absent, Late & Approved Leaves.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Present</span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">✕ Absent</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">⏰ Late</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">L Leave</span>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-extrabold text-slate-900">
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Header Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty lead slots */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-2xl bg-slate-50/40 border border-transparent" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayRecords = dateMap[dateStr] || [];

            const hasPresent = dayRecords.some(r => r.status === 'PRESENT');
            const hasAbsent = dayRecords.some(r => r.status === 'ABSENT');
            const hasLate = dayRecords.some(r => r.status === 'LATE');
            const hasLeave = dayRecords.some(r => r.status === 'LEAVE');

            return (
              <div
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className="h-24 p-2 rounded-2xl border border-slate-200/70 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-white flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">{dayNum}</span>
                  {dayRecords.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {dayRecords.length}
                    </span>
                  )}
                </div>

                {/* Status Badges Preview */}
                <div className="space-y-1">
                  {hasPresent && <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md truncate">✓ Present</div>}
                  {hasLate && <div className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded-md truncate">⏰ Late</div>}
                  {hasAbsent && <div className="text-[10px] font-bold text-rose-700 bg-rose-100/90 px-1.5 py-0.5 rounded-md truncate">✕ Absent</div>}
                  {hasLeave && <div className="text-[10px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded-md truncate">L Leave</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Details Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Attendance Details: ${selectedDate?.dateStr}`}>
        <div className="space-y-3 text-xs">
          {selectedDate?.records.length === 0 ? (
            <p className="text-slate-400 italic py-4 text-center">No attendance sessions recorded for this date.</p>
          ) : (
            selectedDate?.records.map((r) => (
              <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{r.studentName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{r.studentCustomId} • {r.subjectName || 'CS301'}</p>
                </div>
                <Badge status={r.status} />
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
