import React from 'react';
import { Search } from 'lucide-react';

const STATUS_TABS = ['All', 'Upcoming', 'Live', 'Past'];

export default function EventFilters({ statusFilter, onStatusChange, searchQuery, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Status Tabs */}
      <div className="flex gap-1 bg-[#1B1026] p-1 rounded-xl w-max overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onStatusChange(tab)}
            className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              statusFilter === tab
                ? 'bg-[#FF7AB6] text-[#1B1026]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2.5 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl text-xs text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40 w-full sm:w-48 lg:w-56"
        />
      </div>
    </div>
  );
}