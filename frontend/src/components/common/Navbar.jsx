import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, User, LogOut, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as notificationService from '../../services/notificationService';

export default function Navbar({ onMenuToggle }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      notificationService.getUnreadCount(user.id)
        .then(count => setUnreadCount(count))
        .catch(() => setUnreadCount(2));
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between transition-all">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Biometric System Online</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Quick Biometric Simulator Link Button */}
        <Link
          to="/biometric-console"
          className="hidden md:flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-md hover:shadow-indigo-500/20 transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Biometric Console</span>
        </Link>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 line-clamp-1">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role?.replace('ROLE_', '').toLowerCase()}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={logoutUser}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
