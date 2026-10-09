import React, { useState, useEffect } from 'react';
import { getDepartments, getSubjects, getStudents, getFaculty } from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { Building2, BookOpen, GraduationCap, Users, Eye, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { getAttendanceColorClass } from '../utils/formatters';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Department Details Modal State
  const [selectedDept, setSelectedDept] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([getDepartments(), getSubjects(), getStudents(), getFaculty()])
      .then(([deptRes, subRes, stuRes, facRes]) => {
        setDepartments(deptRes);
        setSubjects(subRes);
        setStudents(stuRes);
        setFacultyList(facRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDeptDetails = (dept) => {
    setSelectedDept(dept);
    setIsDetailsModalOpen(true);
  };

  if (loading) return <LoadingSpinner message="Loading Academic Structure & Department Details..." />;

  // Filter students and faculty for selected department modal
  const deptStudents = selectedDept ? students.filter(s => s.departmentId === selectedDept.id) : [];
  const deptFaculty = selectedDept ? facultyList.filter(f => f.departmentId === selectedDept.id) : [];
  const deptSubjects = selectedDept ? subjects.filter(s => s.code?.startsWith(selectedDept.code)) : [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-indigo-600" />
          <span>Academic Departments & Structure</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Explore institute departments, enrolled students, faculty portfolio and courses.</p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((d) => (
          <div key={d.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                  CODE: {d.code}
                </span>
                <button
                  onClick={() => handleOpenDeptDetails(d)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{d.description || `Academic department of ${d.name}`}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span><strong>{d.studentCount || 10}</strong> Students</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-purple-500 shrink-0" />
                <span><strong>{d.facultyCount || 2}</strong> Faculty</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subjects Catalog */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Subject Catalog</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Code</th>
                <th className="pb-3">Subject Name</th>
                <th className="pb-3">Course</th>
                <th className="pb-3">Credits</th>
                <th className="pb-3">Assigned Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-indigo-600 font-mono">{sub.code}</td>
                  <td className="py-3 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-3 text-slate-600">{sub.courseName || 'B.Tech CSE'}</td>
                  <td className="py-3 font-semibold text-slate-700">{sub.credits}</td>
                  <td className="py-3 font-medium text-slate-900">{sub.facultyName || 'Dr. Amit Sharma'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Full Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`Department Portfolio: ${selectedDept?.name}`}
        maxWidth="max-w-2xl"
      >
        {selectedDept && (
          <div className="space-y-6 text-xs">
            {/* Header Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                  {selectedDept.code} Department
                </span>
                <h3 className="text-xl font-black mt-1">{selectedDept.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedDept.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-indigo-400">{deptStudents.length}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Students Enrolled</p>
              </div>
            </div>

            {/* Department Faculty List */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Department Faculty Members ({deptFaculty.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deptFaculty.map((f) => (
                  <div key={f.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <img
                      src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.employeeId}`}
                      alt="Faculty"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{f.fullName}</p>
                      <p className="text-[11px] text-purple-600 font-semibold">{f.designation}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {f.employeeId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Students List */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 text-sm mb-2.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Enrolled Students & Live Attendance Ratio ({deptStudents.length})</span>
              </h4>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {deptStudents.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.studentId}`}
                        alt="Student"
                        className="w-8 h-8 rounded-full border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{s.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {s.studentId} • Roll: {s.rollNo}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${getAttendanceColorClass(s.attendancePercentage || 85.0)}`}>
                      {s.attendancePercentage || 85.0}% Attendance
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
