import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent, getDepartments } from '../services/userService';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Fingerprint,
  Mail,
  Phone,
  Building2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { getAttendanceColorClass } from '../utils/formatters';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    rollNo: '',
    fullName: '',
    email: '',
    phone: '',
    departmentId: 1,
    semester: 6,
    batch: '2023-2027'
  });

  // View Details Modal State
  const [viewingStudent, setViewingStudent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const loadData = () => {
    Promise.all([getStudents(), getDepartments()])
      .then(([studentsRes, deptsRes]) => {
        setStudents(studentsRes);
        setDepartments(deptsRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      studentId: `STU${1000 + students.length + 1}`,
      rollNo: `21010${students.length + 1}`,
      fullName: '',
      email: '',
      phone: '',
      departmentId: departments[0]?.id || 1,
      semester: 6,
      batch: '2023-2027'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      rollNo: student.rollNo,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      departmentId: student.departmentId || 1,
      semester: student.semester || 6,
      batch: student.batch || '2023-2027'
    });
    setIsModalOpen(true);
  };

  const handleOpenViewDetails = (student) => {
    setViewingStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      showError("Please enter student full name.");
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData)
        .then((updated) => {
          showSuccess(`Student ${updated.fullName} updated successfully!`);
          setIsModalOpen(false);
          loadData();
        })
        .catch(err => showError("Failed to update student."));
    } else {
      createStudent(formData)
        .then((created) => {
          showSuccess(`Student ${created.fullName} registered successfully!`);
          setIsModalOpen(false);
          loadData();
        })
        .catch(err => showError("Failed to register student."));
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete student profile for ${name}?`)) {
      deleteStudent(id)
        .then(() => {
          showSuccess("Student deleted successfully.");
          loadData();
        })
        .catch(err => showError("Failed to delete student."));
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = (s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = !selectedDept || s.departmentId === Number(selectedDept);
    return matchesSearch && matchesDept;
  });

  if (loading) return <LoadingSpinner message="Loading Student Directory..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-600" />
            <span>Student Management Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Total {students.length} students enrolled across all departments.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, Student ID, or Roll No..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200 bg-white"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState title="No students found" description="Try adjusting your search query or department filter." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Student Info</th>
                  <th className="py-3.5 px-4">Student ID / Roll</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Attendance %</th>
                  <th className="py-3.5 px-4">Biometric Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.studentId}`}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                          <p className="text-[11px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <p className="font-bold text-indigo-600">{s.studentId}</p>
                      <p className="text-[11px] text-slate-500">Roll: {s.rollNo}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">
                      {s.departmentName || 'CSE'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${getAttendanceColorClass(s.attendancePercentage || 85.0)}`}>
                        {s.attendancePercentage || 85.0}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Fingerprint className="w-3 h-3" />
                        <span>REGISTERED</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenViewDetails(s)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(s)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.fullName)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.fullName}` : "Register New Student"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Rahul Kumar"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student ID</label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@bioattend.edu"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-200 bg-white"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md transition-colors"
            >
              {editingStudent ? "Save Changes" : "Create Student"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student View Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Student Full Details & Profile"
        maxWidth="max-w-xl"
      >
        {viewingStudent && (
          <div className="space-y-6 text-xs">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
              <img
                src={viewingStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStudent.studentId}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-white/20 object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">{viewingStudent.fullName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${getAttendanceColorClass(viewingStudent.attendancePercentage || 85.0)}`}>
                    {viewingStudent.attendancePercentage || 85.0}% Attendance
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-mono mt-0.5">
                  ID: {viewingStudent.studentId} • Roll: {viewingStudent.rollNo}
                </p>
                <p className="text-[11px] text-slate-300 mt-1">{viewingStudent.departmentName}</p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Course & Batch</p>
                <p className="font-bold text-slate-900 mt-0.5">{viewingStudent.courseName || 'B.Tech'} (Sem {viewingStudent.semester || 6})</p>
                <p className="text-[11px] text-slate-500">Batch: {viewingStudent.batch || '2023-2027'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Biometric Hash Status</p>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Optical Hash Active</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">BIO_HASH_{viewingStudent.studentId}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{viewingStudent.email}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                <p className="font-bold text-slate-900 mt-0.5">{viewingStudent.phone || '+91 98765 43210'}</p>
              </div>
            </div>

            {/* Subject Attendance Breakdown */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Subject Attendance Performance</span>
              </h4>
              <div className="space-y-2">
                {[
                  { code: 'CS301', name: 'Data Structures & Algorithms', pct: Math.min(100, (viewingStudent.attendancePercentage || 85) + 3) },
                  { code: 'CS302', name: 'Database Management Systems', pct: Math.max(50, (viewingStudent.attendancePercentage || 85) - 4) },
                  { code: 'CS303', name: 'Java Enterprise Programming', pct: Math.min(100, (viewingStudent.attendancePercentage || 85) + 5) }
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{s.code} - {s.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getAttendanceColorClass(s.pct)}`}>
                      {s.pct.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
