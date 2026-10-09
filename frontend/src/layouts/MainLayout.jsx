import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { Building2, Sparkles } from 'lucide-react';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col">
      {/* Background Campus Image with Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20"
        style={{ backgroundImage: `url('campus_bg.png')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950/95 pointer-events-none" />

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:pl-64 flex-1 flex flex-col transition-all duration-300 relative z-10">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Top CMR Technical Campus Header Banner */}
          <div
            className="relative w-full h-32 sm:h-36 bg-cover bg-center bg-no-repeat rounded-2xl shadow-2xl overflow-hidden mb-6 border border-slate-700/80"
            style={{ backgroundImage: `url('campus_bg.png')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-900/40 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-500/30 text-amber-400">
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CMR Group of Institutions</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    CMR TECHNICAL CAMPUS
                  </h1>
                  <p className="text-xs text-slate-300 font-medium">Explore to Invent • BioAttend System</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Active</span>
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
