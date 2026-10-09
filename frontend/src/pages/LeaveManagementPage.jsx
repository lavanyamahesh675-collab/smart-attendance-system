import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllLeaves, getStudentLeaves, applyLeave, approveLeave, rejectLeave } from '../services/leaveService';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { FileText, Plus, CheckCircle, XCircle, Filter, Calendar } from 'lucide-react';
import { LEAVE_TYPES } from '../utils/constants';

export default function LeaveManagementPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'ROLE_STUDENT';

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Apply Leave Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaveType: 'MEDICAL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    documentUrl: ''
  });

  // Review Modal
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const loadData = () => {
    const fetchPromise = isStudent ? getStudentLeaves(user?.studentId || 1) : getAllLeaves();
    fetchPromise
      .then(res => setLeaves(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.reason) {
      showError("Please provide a reason for the leave application.");
      return;
    }

    applyLeave(user?.studentId || 1, applyForm)
      .then(() => {
        showSuccess("Leave request submitted successfully!");
        setIsApplyModalOpen(false);
        loadData();
      })
      .catch(err => {
        showError(err.response?.data?.message || "Failed to submit leave request.");
      });
  };

  const handleApprove = () => {
    if (!selectedLeave) return;
    approveLeave(selectedLeave.id, reviewRemarks)
      .then(() => {
        showSuccess("Leave request APPROVED!");
        setIsReviewModalOpen(false);
        loadData();
      })
      .catch(() => showError("Failed to approve leave."));
  };

  const handleReject = () => {
    if (!selectedLeave) return;
    rejectLeave(selectedLeave.id, reviewRemarks)
      .then(() => {
        showSuccess("Leave request REJECTED!");
        setIsReviewModalOpen(false);
        loadData();
      })
      .catch(() => showError("Failed to reject leave."));
  };

  const filteredLeaves = leaves.filter(l => !statusFilter || l.status === statusFilter);

  if (loading) return <LoadingSpinner message="Loading Leave Management Module..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-600" />
            <span>Leave Management Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent ? 'Apply for leave and track review status.' : 'Review, approve, or reject student leave applications.'}
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredLeaves.length === 0 ? (
        <EmptyState title="No leave applications found." description="You have no leave requests matching current filter." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Dates & Duration</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <p>{l.studentName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{l.studentCustomId}</p>
                    </td>
                    <td className="py-4 px-4 font-bold text-indigo-600">{l.leaveType}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">
                      {l.startDate} to {l.endDate} ({l.numberOfDays} days)
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">"{l.reason}"</td>
                    <td className="py-4 px-4"><Badge status={l.status} type="leave" /></td>
                    <td className="py-4 px-6 text-right">
                      {!isStudent && l.status === 'PENDING' ? (
                        <button
                          onClick={() => { setSelectedLeave(l); setIsReviewModalOpen(true); }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors"
                        >
                          Review Request
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Student Leave">
        <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
            <select
              value={applyForm.leaveType}
              onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
            >
              {LEAVE_TYPES.map(t => (
                <option key={t} value={t}>{t} LEAVE</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={applyForm.startDate}
                onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={applyForm.endDate}
                onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Leave</label>
            <textarea
              required
              rows={3}
              value={applyForm.reason}
              onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
              placeholder="Provide clear explanation for leave request..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={() => setIsApplyModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md">
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Leave Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Review Leave Request">
        {selectedLeave && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <p className="font-bold text-slate-900 text-sm">{selectedLeave.studentName} ({selectedLeave.studentCustomId})</p>
              <p className="text-slate-600 font-semibold">{selectedLeave.leaveType} Leave • {selectedLeave.numberOfDays} Days</p>
              <p className="text-slate-500 italic">"{selectedLeave.reason}"</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reviewer Remarks</label>
              <input
                type="text"
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="e.g. Approved. Verified medical certificate."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Leave</span>
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Leave</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
