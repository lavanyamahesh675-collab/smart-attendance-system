import React, { useState, useEffect } from 'react';
import { getDailyReport, getRangeReport, getLowAttendanceReport, getLeaveReport } from '../services/reportService';
import { exportToCSV, printReport } from '../utils/exportUtils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { FileSpreadsheet, Download, Printer, Search, Filter } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('daily');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadReport = () => {
    setLoading(true);
    let promise;
    if (reportType === 'daily') {
      promise = getDailyReport();
    } else if (reportType === 'low-attendance') {
      promise = getLowAttendanceReport(75.0);
    } else if (reportType === 'leave') {
      promise = getLeaveReport();
    } else {
      promise = getRangeReport();
    }

    promise
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const handleExportCSV = () => {
    exportToCSV(data, `BioAttend_${reportType}_Report.csv`);
  };

  const handlePrint = () => {
    printReport();
  };

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.studentName && item.studentName.toLowerCase().includes(term)) ||
      (item.fullName && item.fullName.toLowerCase().includes(term)) ||
      (item.studentId && item.studentId.toLowerCase().includes(term)) ||
      (item.subjectName && item.subjectName.toLowerCase().includes(term)) ||
      (item.leaveType && item.leaveType.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600" />
            <span>Reports & Analytics Module</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Generate, audit, print, and export attendance & leave analytics reports.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 flex flex-wrap gap-2 print:hidden">
        {[
          { id: 'daily', label: 'Daily Attendance' },
          { id: 'monthly', label: 'Monthly / Range Report' },
          { id: 'low-attendance', label: 'Low Attendance Alert (<75%)' },
          { id: 'leave', label: 'Leave Summary Report' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between print:hidden">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report entries..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Report Results */}
      {loading ? (
        <LoadingSpinner message="Generating Report Data..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 capitalize">{reportType.replace('-', ' ')} Report</h3>
            <p className="text-xs text-slate-500">Total Entries: {filteredData.length}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name / ID</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Status / Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.studentName || item.fullName || 'Student Entry'}
                      <p className="text-[10px] text-slate-500 font-mono">{item.studentCustomId || item.studentId || item.rollNo}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.subjectName || item.departmentName || item.leaveType || 'General Session'}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      {item.status ? (
                        <Badge status={item.status} />
                      ) : (
                        <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          {item.attendancePercentage}% Attendance
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
