import React from 'react';
import { Search } from 'lucide-react';

export default function StudentFilters({
  searchQuery,
  setSearchQuery,
  classFilter,
  setClassFilter
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/40">
        <div className="space-y-0.5">
          <h3 className="text-lg font-black text-white">Student Directory</h3>
          <p className="text-zinc-400 text-xs">View and manage all your students</p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..." 
              className="bg-[#1B1026]/90 text-xs border border-zinc-800 focus:border-[#FF7AB6]/40 rounded-xl py-2 pl-8 pr-4 text-zinc-300 placeholder-zinc-500 outline-none w-44" 
            />
          </div>
        </div>
      </div>

      {/* Sub Tabs class filtering state */}
      <div className="flex items-center gap-1.5 p-1 bg-[#1B1026]/60 border border-zinc-800/40 rounded-xl w-max">
        {['All Students', '10A', '10B'].map((tab) => (
          <button
            key={tab}
            onClick={() => setClassFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              classFilter === tab 
                ? 'bg-[#1B1026] text-[#FF7AB6] shadow-sm font-bold' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}