import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFacultyDashboard } from '../services/dashboardService';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  FileText,
  PlusCircle,
  Eye,
  FileSpreadsheet,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyDashboard(user?.id || 2)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner message="Loading Faculty Dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
            Faculty Portal
          </span>
          <h2 className="text-2xl font-black mt-2">Welcome back, {data?.facultyName || user?.fullName}! 👋</h2>
          <p className="text-xs text-slate-300 mt-1">Department: {data?.departmentName || 'Computer Science & Engineering'}</p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Link
            to="/biometric-console"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mark Attendance</span>
          </Link>
          <Link
            to="/leave-management"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/20"
          >
            <FileText className="w-4 h-4" />
            <span>Review Leave</span>
          </Link>
        </div>
      </div>

      {/* Faculty Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="My Subjects" value={data?.myClassesCount || 2} icon={BookOpen} color="indigo" />
        <StatCard title="Today's Classes" value={data?.todayClassesCount || 2} icon={Calendar} color="purple" />
        <StatCard title="Total Students" value={data?.totalStudents || 20} icon={Users} color="blue" />
        <StatCard title="Marked Today" value={data?.todayAttendanceMarkedCount || 18} icon={CheckCircle2} color="emerald" />
        <StatCard title="Pending Leaves" value={data?.pendingLeaveRequestsCount || 1} icon={FileText} color="amber" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Subjects & Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Assigned Subjects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data?.assignedSubjects || []).map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{sub.credits} Credits</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{sub.name}</h4>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                    <span className="text-xs text-slate-500">Scheduled: 09:00 AM</span>
                    <Link to="/attendance" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      <span>View Records</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attendance Marked */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Class Attendance Stream</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Roll No</th>
                    <th className="pb-3">Subject</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.recentClassAttendance || []).slice(0, 5).map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{rec.studentName}</td>
                      <td className="py-3 text-slate-500">{rec.rollNo}</td>
                      <td className="py-3 font-medium text-slate-700">{rec.subjectCode}</td>
                      <td className="py-3"><Badge status={rec.status} /></td>
                      <td className="py-3 text-slate-500">{rec.isBiometric ? "🖐 Biometric" : "Manual"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Leaves Review Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Pending Leave Requests</h3>
              <Link to="/leave-management" className="text-xs text-indigo-600 font-bold hover:underline">View All</Link>
            </div>

            <div className="space-y-3">
              {(data?.pendingLeaves || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No pending leave requests.</p>
              ) : (
                (data?.pendingLeaves || []).map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{req.studentName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        {req.leaveType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">"{req.reason}"</p>
                    <div className="text-[11px] text-slate-500 font-medium pt-1">
                      {req.startDate} to {req.endDate} ({req.numberOfDays} days)
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/leave-management"
            className="w-full mt-6 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center block transition-colors"
          >
            Go to Leave Review Center
          </Link>
        </div>
      </div>
    </div>
  );
}
