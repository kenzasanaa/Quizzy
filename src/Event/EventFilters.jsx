import React from 'react';
import { Search } from 'lucide-react';

export default function EventFilters({
  searchQuery,
  setSearchQuery,
  selectedQuizFilter,
  setSelectedQuizFilter,
  quizzesList = [],
  eventFilter,
  setEventFilter
}) {
  return (
    <div className="space-y-6 pb-4 border-b border-zinc-800/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="text-lg font-black text-white">Event Calendar</h3>
          <p className="text-zinc-400 text-xs">View and manage your scheduled quiz events</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..." 
              className="bg-[#170E2A]/90 text-xs border border-zinc-800 focus:border-[#FBB9A6]/40 rounded-xl py-2 pl-8 pr-4 text-zinc-300 placeholder-zinc-500 outline-none w-44" 
            />
          </div>

          <select 
            value={selectedQuizFilter}
            onChange={(e) => setSelectedQuizFilter(e.target.value)}
            className="bg-[#170E2A]/90 border border-zinc-800/40 text-xs focus:border-[#FBB9A6]/40 rounded-xl py-2 px-3 text-zinc-300 outline-none cursor-pointer"
          >
            <option value="All Quizzes">All Quizzes</option>
            {quizzesList.map(q => (
              <option key={q.id} value={q.title}>{q.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-[#170E2A]/60 border border-zinc-800/40 rounded-xl w-max">
        {['All Events', 'Active', 'Upcoming', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setEventFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              eventFilter === tab 
                ? 'bg-[#170E2A] text-[#FF7AB6] shadow-sm font-bold' 
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