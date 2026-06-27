import React from 'react';
import { Search, Menu, Plus } from 'lucide-react';

export default function Header({ 
  userRole, 
  onMenuClick, 
  onCreateQuiz 
}) {
  return (
    <header className="h-20 border-b border-[#FF7AB6]/10 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-zinc-300 hover:text-white p-2 border border-zinc-800 rounded-xl bg-[#251836]/40 cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div className="relative w-44 sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-[#251836]/40 text-sm border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-zinc-300 placeholder-zinc-500 outline-none focus:border-[#FF7AB6]/40" 
          />
        </div>
      </div>

      {userRole === 'teacher' && (
        <button 
          onClick={onCreateQuiz}
          className="border border-[#FF7AB6]/40 hover:border-[#FF7AB6] text-[#FF7AB6] font-semibold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all bg-[#FF7AB6]/5 outline-none whitespace-nowrap cursor-pointer"
        >
          <Plus size={16} /> Create Quiz
        </button>
      )}
    </header>
  );
}