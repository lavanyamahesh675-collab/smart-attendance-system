import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as notificationService from '../services/notificationService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Bell, CheckCircle2, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    if (!user?.id) return;
    notificationService.getUserNotifications(user.id)
      .then(res => setNotifications(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id).then(() => loadNotifications());
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead(user.id).then(() => loadNotifications());
  };

  if (loading) return <LoadingSpinner message="Loading Notifications..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-600" />
            <span>Notification Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Real-time attendance warnings, leave approvals and system alerts.</p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-indigo-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You have no unread or archived alerts." icon={Bell} />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead ? 'bg-indigo-50/40 border-indigo-200/80 shadow-sm' : 'bg-white border-slate-200/80 opacity-80'
              }`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${
                n.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                n.type === 'ALERT' || n.type === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {n.type === 'SUCCESS' ? <CheckCircle2 className="w-6 h-6" /> :
                 n.type === 'ALERT' || n.type === 'WARNING' ? <AlertTriangle className="w-6 h-6" /> :
                 <Info className="w-6 h-6" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
