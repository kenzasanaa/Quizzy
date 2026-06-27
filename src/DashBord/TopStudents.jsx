import React from 'react';
import { Award } from 'lucide-react';

export default function TopStudents({ topStudents = [] }) {
  return (
    <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 sm:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-black text-white">Top Students</h3>
        <p className="text-zinc-400 text-xs mt-0.5">Students with highest quiz scores</p>
      </div>

      <div className="space-y-4">
        {topStudents.map((std, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="text-sm font-bold text-zinc-500 w-4 shrink-0">{std.rank}</span>
              <img 
                src={std.avatar} 
                alt={std.name} 
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#FF7AB6]/20 shrink-0" 
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-white leading-tight truncate">{std.name}</h4>
                <span className="text-xs text-zinc-400 block truncate">{std.subject}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-black text-[#FFB86B] shrink-0">
              <Award size={16} />
              <span>{std.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}