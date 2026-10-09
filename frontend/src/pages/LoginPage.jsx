import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Fingerprint, Eye, EyeOff, Lock, User, Sparkles, ShieldAlert, Building2 } from 'lucide-react';
import { APP_NAME, TAGLINE } from '../utils/constants';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = await loginUser(username, password);
      showSuccess(`Welcome back, ${data.fullName}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid username or password. Please try again.";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    setLoading(true);
    try {
      const data = await loginUser(u, p);
      showSuccess(`Welcome back, ${data.fullName}!`);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 overflow-hidden">
      {/* Background Campus Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('campus_bg.png'), url('/campus_bg.png')` }}
      />
      {/* Soft Dark Vignette & Blur Overlay for high readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/65 backdrop-blur-[3px]" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 my-8">
        {/* Campus Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-6 py-1.5 px-3 rounded-full bg-slate-900/90 text-white border border-slate-700 text-xs font-bold shadow-md">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>CMR TECHNICAL CAMPUS</span>
        </div>

        {/* Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-xl shadow-indigo-500/30 mb-3">
            <Fingerprint className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{APP_NAME}</h1>
          <p className="text-xs text-slate-600 font-semibold mt-1">{TAGLINE}</p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="mb-6 p-3.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Demo Login Accounts
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => quickLogin('admin', 'Admin@123')}
              className="py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
            >
              ⚡ Admin
            </button>
            <button
              type="button"
              onClick={() => quickLogin('faculty', 'Faculty@123')}
              className="py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
            >
              ⚡ Faculty
            </button>
            <button
              type="button"
              onClick={() => quickLogin('student', 'Student@123')}
              className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
            >
              ⚡ Student
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Username or Email</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin, faculty, or student"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm font-semibold transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm font-semibold transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contact administrator to reset your password."); }} className="text-indigo-600 font-bold hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sign In to BioAttend Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] text-slate-500 border-t border-slate-200/80 pt-4 font-semibold">
          CMR Technical Campus • BioAttend System v1.0
        </div>
      </div>
    </div>
  );
}
