import React from 'react';
import { Calendar } from 'lucide-react';

export default function EmptyState({ onSchedule }) {
  return (
    <div className="text-center py-16 text-zinc-500">
      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p className="text-sm font-medium">No scheduled quiz sessions found matching the filter.</p>
      <button 
        onClick={onSchedule}
        className="mt-4 text-[#FF7AB6] text-xs font-semibold hover:underline"
      >
        Schedule your first event
      </button>
    </div>
  );
}