import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  CalendarCheck,
  Fingerprint,
  FileSpreadsheet,
  FileText,
  Bell,
  User,
  LogOut,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { APP_NAME, TAGLINE } from '../../utils/constants';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logoutUser } = useAuth();
  const role = user?.role;

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Students", icon: GraduationCap },
    { to: "/faculty", label: "Faculty", icon: Users },
    { to: "/departments", label: "Departments & Subjects", icon: Building2 },
    { to: "/attendance", label: "Attendance Records", icon: CalendarCheck },
    { to: "/biometric-console", label: "Biometric Console", icon: Fingerprint, badge: "Sim" },
    { to: "/leave-management", label: "Leave Requests", icon: FileText },
    { to: "/reports", label: "Reports & Analytics", icon: FileSpreadsheet },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const facultyLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Class Attendance", icon: CalendarCheck },
    { to: "/biometric-console", label: "Mark Attendance", icon: Fingerprint },
    { to: "/students", label: "Students Directory", icon: GraduationCap },
    { to: "/leave-management", label: "Leave Requests", icon: FileText },
    { to: "/reports", label: "Reports", icon: FileSpreadsheet },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/my-attendance", label: "My Attendance", icon: CalendarCheck },
    { to: "/attendance-calendar", label: "Attendance Calendar", icon: BookOpen },
    { to: "/apply-leave", label: "Apply Leave", icon: FileText },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "My Profile", icon: User },
  ];

  const navLinks = role === 'ROLE_ADMIN' ? adminLinks :
                   role === 'ROLE_FACULTY' ? facultyLinks : studentLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Fingerprint className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">{APP_NAME}</span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{TAGLINE}</p>
            </div>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="px-6 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Logged as</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
            role === 'ROLE_ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
            role === 'ROLE_FACULTY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_FACULTY' ? 'Faculty' : 'Student'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
