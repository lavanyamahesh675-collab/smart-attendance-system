import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-7xl font-black text-indigo-600">404</h1>
      <h2 className="text-xl font-bold text-slate-900 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">The page you are looking for does not exist or has been moved.</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
