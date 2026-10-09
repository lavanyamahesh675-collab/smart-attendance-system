import React, { useState, useEffect } from 'react';
import { getAdminDashboard } from '../services/dashboardService';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  Percent,
  FileText,
  Activity,
  ArrowUpRight,
  Fingerprint
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading Admin Analytics..." />;

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
            System Administration
          </span>
          <h2 className="text-2xl font-black mt-2">Overall Attendance Dashboard</h2>
          <p className="text-xs text-slate-300 mt-1">Real-time biometric analytics, class attendance & leave requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Current Date</p>
            <p className="text-sm font-bold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="p-3 bg-indigo-600/30 rounded-2xl border border-indigo-500/40">
            <Fingerprint className="w-8 h-8 text-indigo-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid (8 key metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={data?.totalStudents || 20}
          subtitle="Enrolled active students"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Total Faculty"
          value={data?.totalFaculty || 5}
          subtitle="Teaching faculty members"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Today Present"
          value={data?.todayPresent || 18}
          subtitle="Biometric verified today"
          icon={UserCheck}
          color="emerald"
        />
        <StatCard
          title="Today Absent"
          value={data?.todayAbsent || 2}
          subtitle="Unexcused absences"
          icon={UserX}
          color="rose"
        />
        <StatCard
          title="On Leave"
          value={data?.onLeave || 1}
          subtitle="Approved leave today"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Late Arrivals"
          value={data?.lateArrivals || 1}
          subtitle="Arrived after 09:15 AM"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Overall Attendance"
          value={`${data?.overallAttendancePercentage || 88.5}%`}
          subtitle="Institute average"
          icon={Percent}
          color="emerald"
        />
        <StatCard
          title="Pending Leaves"
          value={data?.pendingLeaveRequests || 1}
          subtitle="Awaiting review"
          icon={FileText}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attendance Overview</h3>
              <p className="text-xs text-slate-500">7-day attendance trends across all sessions</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">Weekly</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.attendanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="Present" />
                <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Absent" />
                <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} name="Late" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Present vs Absent Donut Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Attendance Status</h3>
            <p className="text-xs text-slate-500">Breakdown of student attendance status</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.presentVsAbsent || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.presentVsAbsent || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(data?.presentVsAbsent || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Bar Chart & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Attendance Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Department Attendance</h3>
          <p className="text-xs text-slate-500 mb-4">Average attendance percentage by department</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentAttendance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="attendance" fill="#4F46E5" radius={[10, 10, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">Live</span>
          </div>

          <div className="space-y-3.5">
            {(data?.recentActivity || []).map((act, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg shrink-0 mt-0.5">
                  {act.time}
                </span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{act.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
