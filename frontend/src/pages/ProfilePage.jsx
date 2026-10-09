import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Phone, Building2, Shield, Calendar, Edit3, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { showSuccess } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || 'Rahul Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'student@bioattend.edu');

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, fullName, phone, email };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    showSuccess("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-white/20 object-cover shadow-2xl shrink-0"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black">{user?.fullName}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              {user?.role?.replace('ROLE_', '')}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{user?.email} • {user?.departmentName || 'Computer Science & Engineering'}</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-colors border border-white/20 flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>Personal Account Information</span>
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Full Name</p>
                <p className="font-bold text-slate-900 text-sm">{user?.fullName}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p className="font-bold text-slate-900 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                <p className="font-bold text-slate-900 text-sm">{user?.phone || '+91 98765 43210'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
                <p className="font-bold text-slate-900 text-sm">{user?.departmentName || 'Computer Science & Eng.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
