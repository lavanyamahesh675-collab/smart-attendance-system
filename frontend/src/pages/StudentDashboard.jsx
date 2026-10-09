import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentDashboard } from '../services/dashboardService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  UserX,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  PlusCircle,
  Award,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { getAttendanceColorClass } from '../utils/formatters';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard(user?.id || 3)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner message="Loading Student Portal..." />;

  const pct = data?.overallAttendancePercentage || 85.0;
  const isLow = pct < 75.0;
  const isCritical = pct < 65.0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
            Student Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Good Morning, {data?.studentName || user?.fullName || 'Student'} 👋
          </h2>
          <p className="text-xs text-slate-300 mt-1">Student ID: {data?.studentId || 'STU1001'} • Department of CSE</p>
        </div>

        <Link
          to="/apply-leave"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for Leave</span>
        </Link>
      </div>

      {/* Low / Critical Attendance Alert Warning Banner */}
      {isLow && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          isCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertTriangle className={`w-6 h-6 shrink-0 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
          <div>
            <h4 className="text-sm font-bold">
              {isCritical ? '🔴 Critical Attendance Warning!' : '⚠ Low Attendance Alert!'}
            </h4>
            <p className="text-xs mt-0.5">
              Your overall attendance is {pct}%. College policy requires a minimum of 75% attendance to appear for semester examinations.
            </p>
          </div>
        </div>
      )}

      {/* Attendance Stats Cards & Circular Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Main Circular Progress Card */}
        <div className="md:col-span-1 lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Overall Attendance</p>
          
          {/* Circular Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isCritical ? 'text-rose-500' : isLow ? 'text-amber-500' : 'text-emerald-500'}
                strokeDasharray={`${pct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">{pct}%</span>
              <span className="text-[10px] text-slate-400 font-semibold">Total Ratio</span>
            </div>
          </div>

          <div className="mt-4">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getAttendanceColorClass(pct)}`}>
              {pct >= 75 ? 'Good Standing' : 'Below Requirement'}
            </span>
          </div>
        </div>

        {/* 4 Stat Breakdown Cards */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Present</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-4">{data?.presentCount || 17}</h3>
          <p className="text-xs text-slate-500 mt-1">Attended sessions</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Absent</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-4">{data?.absentCount || 2}</h3>
          <p className="text-xs text-slate-500 mt-1">Missed sessions</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Leave</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-4">{data?.leaveCount || 1}</h3>
          <p className="text-xs text-slate-500 mt-1">Sanctioned leaves</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Late</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-4">{data?.lateCount || 1}</h3>
          <p className="text-xs text-slate-500 mt-1">Late check-ins</p>
        </div>
      </div>

      {/* Subject-Wise Attendance Progress */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Subject-Wise Attendance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.subjectWiseAttendance || []).map((sub, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600">{sub.subjectCode}</span>
                  <h4 className="text-sm font-bold text-slate-800">{sub.subjectName}</h4>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getAttendanceColorClass(sub.percentage)}`}>
                  {sub.percentage}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span>Attended: {sub.attended}/{sub.totalClasses} classes</span>
                <span>{sub.percentage >= 75 ? '✓ On Track' : '⚠ Action Needed'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Leaves Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance Log */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Attendance Records</h3>
            <Link to="/attendance-calendar" className="text-xs font-bold text-indigo-600 hover:underline">View Calendar</Link>
          </div>
          <div className="space-y-3">
            {(data?.recentAttendance || []).slice(0, 5).map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{rec.subjectName || 'CS301 Data Structures'}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rec.sessionDate} • {rec.isBiometric ? 'Biometric Check-in' : 'Manual'}</p>
                </div>
                <Badge status={rec.status} />
              </div>
            ))}
          </div>
        </div>

        {/* My Leave Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">My Leave Applications</h3>
            <Link to="/apply-leave" className="text-xs font-bold text-indigo-600 hover:underline">+ New Leave</Link>
          </div>
          <div className="space-y-3">
            {(data?.recentLeaves || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No leave applications submitted yet.</p>
            ) : (
              (data?.recentLeaves || []).map((leave) => (
                <div key={leave.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{leave.leaveType} Leave</span>
                    <Badge status={leave.status} type="leave" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">"{leave.reason}"</p>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                    <span>{leave.startDate} to {leave.endDate} ({leave.numberOfDays} days)</span>
                    {leave.reviewerRemarks && <span>Remarks: {leave.reviewerRemarks}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
