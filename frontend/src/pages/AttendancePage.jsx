import React, { useState, useEffect } from 'react';
import { getAllAttendance, markAttendance, updateAttendance } from '../services/attendanceService';
import { getStudents, getSubjects } from '../services/userService';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { CalendarCheck, Plus, Search, Filter, Edit2, Fingerprint } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Manual Mark Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markForm, setMarkForm] = useState({
    sessionId: 1,
    studentId: 1,
    status: 'PRESENT',
    remarks: 'Manual entry'
  });

  const { showSuccess, showError } = useNotification();

  const loadData = () => {
    Promise.all([getAllAttendance(), getStudents(), getSubjects()])
      .then(([recRes, stuRes, subRes]) => {
        setRecords(recRes);
        setStudents(stuRes);
        setSubjects(subRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkSubmit = (e) => {
    e.preventDefault();
    markAttendance(markForm)
      .then(() => {
        showSuccess("Attendance marked successfully!");
        setIsModalOpen(false);
        loadData();
      })
      .catch(err => {
        showError(err.response?.data?.message || "Failed to mark attendance.");
      });
  };

  const handleStatusChange = (recordId, newStatus) => {
    updateAttendance(recordId, newStatus, "Updated by faculty/admin")
      .then(() => {
        showSuccess("Status updated!");
        loadData();
      })
      .catch(err => showError("Failed to update status."));
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = (r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.studentCustomId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Loading Attendance Records..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-indigo-600" />
            <span>Attendance Master Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">View, correct and audit date-wise & biometric class attendance records.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Attendance Entry</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, ID or subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="LATE">LATE</option>
            <option value="HALF_DAY">HALF_DAY</option>
            <option value="LEAVE">LEAVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <EmptyState title="No attendance records found" description="Try changing your filters or search criteria." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Edit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-700 font-mono">
                      {r.sessionDate ? formatDate(r.sessionDate) : 'Today'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{r.studentName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{r.studentCustomId}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {r.subjectName || 'CS301 Data Structures'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        {r.isBiometric ? <Fingerprint className="w-3.5 h-3.5 text-indigo-600" /> : null}
                        <span>{r.isBiometric ? `BIO Terminal (${r.deviceId || 'BIO-001'})` : 'Faculty Manual'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={r.status} />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="PRESENT">PRESENT</option>
                        <option value="ABSENT">ABSENT</option>
                        <option value="LATE">LATE</option>
                        <option value="HALF_DAY">HALF_DAY</option>
                        <option value="LEAVE">LEAVE</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Mark Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Attendance Record">
        <form onSubmit={handleMarkSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
            <select
              value={markForm.studentId}
              onChange={(e) => setMarkForm({ ...markForm, studentId: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-medium"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={markForm.status}
              onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
            >
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="LEAVE">LEAVE</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
            <input
              type="text"
              value={markForm.remarks}
              onChange={(e) => setMarkForm({ ...markForm, remarks: e.target.value })}
              placeholder="e.g. Approved medical leave / Lab attendance"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md">
              Save Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
