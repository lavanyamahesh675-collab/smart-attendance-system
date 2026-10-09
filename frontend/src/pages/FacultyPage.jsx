import React, { useState, useEffect } from 'react';
import { getFaculty, createFaculty, getDepartments } from '../services/userService';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { Users, Search, Plus, Mail, Phone, Building2, Briefcase, Eye, BookOpen, Calendar } from 'lucide-react';

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    designation: 'Assistant Professor',
    departmentId: 1
  });

  // View Details Modal State
  const [viewingFaculty, setViewingFaculty] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { showSuccess, showError } = useNotification();

  const loadData = () => {
    Promise.all([getFaculty(), getDepartments()])
      .then(([facRes, deptRes]) => {
        setFacultyList(facRes);
        setDepartments(deptRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      employeeId: `EMP${1000 + facultyList.length + 1}`,
      fullName: '',
      email: '',
      phone: '',
      designation: 'Assistant Professor',
      departmentId: departments[0]?.id || 1
    });
    setIsModalOpen(true);
  };

  const handleOpenViewDetails = (faculty) => {
    setViewingFaculty(faculty);
    setIsDetailsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName) {
      showError("Please enter faculty full name.");
      return;
    }

    createFaculty(formData)
      .then((newFac) => {
        showSuccess(`Faculty member ${newFac.fullName} registered successfully!`);
        setIsModalOpen(false);
        loadData();
      })
      .catch(err => showError("Failed to add faculty member."));
  };

  const filteredFaculty = facultyList.filter(f =>
    f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading Faculty Directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" />
            <span>Faculty Management Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Teaching faculty members across all institute departments.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search faculty by name, ID or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((f) => (
          <div key={f.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.employeeId}`}
                  alt="Faculty"
                  className="w-12 h-12 rounded-2xl border border-slate-200 object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{f.fullName}</h3>
                  <p className="text-xs font-semibold text-purple-600">{f.designation}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Employee ID: <strong className="text-slate-900 font-mono">{f.employeeId}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Department: <strong className="text-slate-900">{f.departmentName || 'Computer Science'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{f.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Joined: {f.joinDate || '2020-08-15'}</span>
              <button
                onClick={() => handleOpenViewDetails(f)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Faculty Member">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Dr. Amit Sharma"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-200 font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="faculty@bioattend.edu"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
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
              className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md"
            >
              Save Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Faculty Profile & Teaching Portfolio"
        maxWidth="max-w-lg"
      >
        {viewingFaculty && (
          <div className="space-y-6 text-xs">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-950 text-white shadow-md">
              <img
                src={viewingFaculty.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingFaculty.employeeId}`}
                alt="Faculty"
                className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover shrink-0"
              />
              <div>
                <h3 className="text-lg font-black">{viewingFaculty.fullName}</h3>
                <p className="text-xs text-purple-300 font-semibold">{viewingFaculty.designation}</p>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">Employee ID: {viewingFaculty.employeeId}</p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
                <p className="font-bold text-slate-900 mt-0.5">{viewingFaculty.departmentName || 'Computer Science'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Join Date</p>
                <p className="font-bold text-slate-900 mt-0.5">{viewingFaculty.joinDate || '2020-08-15'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{viewingFaculty.email}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                <p className="font-bold text-slate-900 mt-0.5">{viewingFaculty.phone || '+91 98765 00001'}</p>
              </div>
            </div>

            {/* Assigned Subjects */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Assigned Teaching Courses</span>
              </h4>
              <div className="space-y-2">
                {(viewingFaculty.assignedSubjects || ["CS301 Data Structures & Algorithms", "CS303 Java Enterprise Programming"]).map((sub, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <span className="font-bold text-purple-950">{sub}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">4 Credits</span>
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
