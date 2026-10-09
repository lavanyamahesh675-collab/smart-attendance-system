import React from 'react';
import { ClipboardList } from 'lucide-react';

export default function EmptyState({
  title = "No attendance records found.",
  description = "Try changing your filters or search query.",
  icon: Icon = ClipboardList,
  actionButton
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 my-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      {actionButton && (
        <div className="mt-5">
          {actionButton}
        </div>
      )}
    </div>
  );
}
