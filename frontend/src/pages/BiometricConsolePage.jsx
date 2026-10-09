import React, { useState, useEffect } from 'react';
import { getDeviceStatus, simulateBiometricScan, getBiometricLogs } from '../services/biometricService';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import {
  Fingerprint,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Search,
  MapPin,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function BiometricConsolePage() {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [studentIdInput, setStudentIdInput] = useState('STU1001');
  const [deviceCode, setDeviceCode] = useState('BIO-001');
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError, showWarning } = useNotification();

  const loadData = () => {
    Promise.all([getDeviceStatus(), getBiometricLogs()])
      .then(([statusRes, logsRes]) => {
        setDeviceInfo(statusRes);
        setLogs(logsRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScan = (e) => {
    if (e) e.preventDefault();
    if (!studentIdInput) return;

    setScanning(true);
    setLastResult(null);

    // Simulate realistic scanner processing delay (1.2s)
    setTimeout(() => {
      simulateBiometricScan(studentIdInput, deviceCode)
        .then((res) => {
          setLastResult(res);
          if (res.success) {
            showSuccess(`Verified: ${res.studentName} (${res.status})`);
          } else if (res.verificationResult === 'DUPLICATE') {
            showWarning(res.message);
          } else {
            showError(res.message);
          }
          loadData(); // Refresh log feed
        })
        .catch((err) => {
          showError("Biometric verification system error.");
        })
        .finally(() => {
          setScanning(false);
        });
    }, 1200);
  };

  if (loading) return <LoadingSpinner message="Connecting to Biometric Hardware Simulator..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Biometric Console Hardware</span>
            </span>
          </div>
          <h2 className="text-2xl font-black">Fingerprint Verification Simulator</h2>
          <p className="text-xs text-slate-300 mt-1">
            Simulate real-time biometric terminal scans, duplicate detection & late check-ins.
          </p>
        </div>

        {/* Device Status Badge */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">Status: ONLINE</p>
            <p className="text-slate-300 text-[11px]">Terminal: {deviceCode} • {deviceInfo?.location || 'Academic Block A'}</p>
          </div>
        </div>
      </div>

      {/* Console Interactive Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Scanner Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <span>Biometric Terminal Console</span>
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                1:N Matching Mode
              </span>
            </div>

            {/* Quick Demo ID Buttons */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Select Demo Student Fingerprint:</label>
              <div className="grid grid-cols-3 gap-2">
                {['STU1001', 'STU1002', 'STU1003', 'STU1004', 'STU1005', 'STU9999'].map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStudentIdInput(id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      studentIdInput === id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {id === 'STU9999' ? 'Unknown ID' : id}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual ID Input Form */}
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Student ID or Roll Number</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="Enter e.g. STU1001 or 2101001"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm font-bold uppercase transition-all"
                  />
                </div>
              </div>

              {/* Fingerprint Scanner Visual Animation Box */}
              <div className="relative my-6 p-8 rounded-3xl bg-slate-900 flex flex-col items-center justify-center overflow-hidden border border-slate-800 group">
                {/* Background scanning laser beam line */}
                {scanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-line z-10" />
                )}

                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  scanning ? 'bg-indigo-500/20 text-cyan-400 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]' :
                  lastResult?.success ? 'bg-emerald-500/20 text-emerald-400' :
                  lastResult?.verificationResult === 'DUPLICATE' ? 'bg-amber-500/20 text-amber-400' :
                  lastResult?.verificationResult === 'FAILED' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-slate-800 text-indigo-400 group-hover:scale-105'
                }`}>
                  <Fingerprint className={`w-14 h-14 transition-all ${scanning ? 'animate-pulse' : ''}`} />
                </div>

                <p className="text-xs font-bold text-slate-300 mt-4 tracking-wide uppercase">
                  {scanning ? 'Scanning Fingerprint Hash...' : 'Place Finger / Click Scan'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Optical Sensor 500 DPI • AES 256 Hash</p>
              </div>

              <button
                type="submit"
                disabled={scanning || !studentIdInput}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Fingerprint...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Simulate Biometric Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Instant Verification Display Result & Live Logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Verification Result Display Card (matching exact prompt format) */}
          {lastResult ? (
            <div className={`p-6 rounded-3xl border shadow-lg transition-all duration-300 animate-in fade-in ${
              lastResult.success ? 'bg-emerald-950 text-emerald-100 border-emerald-800' :
              lastResult.verificationResult === 'DUPLICATE' ? 'bg-amber-950 text-amber-100 border-amber-800' :
              'bg-rose-950 text-rose-100 border-rose-800'
            }`}>
              <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  {lastResult.success ? (
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  ) : lastResult.verificationResult === 'DUPLICATE' ? (
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-black tracking-tight">
                      {lastResult.success ? '✓ Identity Verified' : lastResult.verificationResult === 'DUPLICATE' ? '⚠ Duplicate Attendance' : '✕ Verification Failed'}
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5">{lastResult.message}</p>
                  </div>
                </div>
                {lastResult.status && (
                  <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border ${
                    lastResult.status === 'PRESENT' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' :
                    lastResult.status === 'LATE' ? 'bg-amber-500/20 border-amber-400 text-amber-300' :
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    STATUS: {lastResult.status}
                  </span>
                )}
              </div>

              {/* Exact output details formatted cleanly */}
              {lastResult.studentName && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="opacity-60 text-[10px] uppercase font-bold">Student Name</p>
                    <p className="font-bold text-sm mt-0.5">{lastResult.studentName}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="opacity-60 text-[10px] uppercase font-bold">Student ID</p>
                    <p className="font-bold text-sm mt-0.5">{lastResult.studentId}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="opacity-60 text-[10px] uppercase font-bold">Check-in Time</p>
                    <p className="font-bold text-sm mt-0.5">{lastResult.timeFormatted || '09:02 AM'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="opacity-60 text-[10px] uppercase font-bold">Device Code</p>
                    <p className="font-bold text-sm mt-0.5">{lastResult.deviceCode || 'BIO-001'}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-100 border border-slate-200/80 text-center">
              <Fingerprint className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-800">Biometric Verification Console Standby</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Select a student ID or enter a custom ID on the left to simulate instant fingerprint verification.
              </p>
            </div>
          )}

          {/* Live Biometric Log Table Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Live Biometric Terminal Audit Logs</h3>
              <button
                onClick={loadData}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Student ID</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Verification</th>
                    <th className="pb-3">Assigned Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.slice(0, 7).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 text-slate-500 font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '09:02 AM'}
                      </td>
                      <td className="py-3 font-bold text-indigo-600">{log.studentId}</td>
                      <td className="py-3 font-bold text-slate-900">{log.studentName || '—'}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.verificationResult === 'MATCHED' ? 'bg-emerald-100 text-emerald-800' :
                          log.verificationResult === 'DUPLICATE' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {log.verificationResult}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-700">{log.statusAssigned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
