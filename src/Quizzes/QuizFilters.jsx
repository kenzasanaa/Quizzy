import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function QuizFilters({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  const categories = ['All Categories', 'Science', 'Mathematics', 'Chemistry'];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#170E2A]/60 border border-zinc-800/40 rounded-xl w-max">
        {['All Quizzes', 'Published', 'Drafts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#170E2A] text-[#FF7AB6] shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Search & Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quizzes..."
            className="bg-[#170E2A]/90 text-xs border border-zinc-800 focus:border-[#FBB9A6]/40 rounded-xl py-2 pl-8 pr-4 text-zinc-300 placeholder-zinc-500 outline-none w-44"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#170E2A]/90 border border-zinc-800/40 text-xs focus:border-[#FBB9A6]/40 rounded-xl py-2 pl-3 pr-8 text-zinc-300 outline-none cursor-pointer appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}