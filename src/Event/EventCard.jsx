import React from 'react';
import { BookOpen, Calendar, Clock, Users, MoreVertical, Edit3, Copy, Trash2 } from 'lucide-react';
import { getEventStatus, formatDisplayDateTime } from './eventHelpers';

export default function EventCard({
  evt,
  userRole,
  activeDropdownId,
  setActiveDropdownId,
  onEdit,
  onDuplicate,
  onDelete
}) {
  const status = getEventStatus(evt);
  const isMenuOpen = activeDropdownId === evt.id;

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setActiveDropdownId(isMenuOpen ? null : evt.id);
  };

  return (
    <div className="p-4 rounded-2xl border bg-[#1B1026]/60 border-zinc-800/40 hover:border-zinc-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
      <div className="flex items-start gap-4 min-w-0">
        
        {evt.iconType === 'book' ? (
          <div className="p-3.5 rounded-xl border shrink-0 bg-[#170E2A] text-[#9396C2] border-[#9396C2]/10">
            <BookOpen size={18} />
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border shrink-0 bg-[#FFB86B]/15 text-[#FFB86B] border-[#FFB86B]/20">
            <Calendar size={18} />
          </div>
        )}

        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-sm text-white truncate">{evt.title}</h4>
            
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              status === 'Active' 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                : status === 'Upcoming' 
                ? 'bg-indigo-500/10 text-[#9396C2] border border-[#9396C2]/20' 
                : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
            }`}>
              {status}
            </span>
          </div>

          <p className="text-zinc-400 text-xs truncate max-w-sm sm:max-w-md">
            {evt.description || "Basic concepts of biology for beginners"}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen size={12} /> 15 questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {formatDisplayDateTime(evt.date, evt.clockTime)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {evt.participants || "32 completions"}
            </span>
            <span className="text-[10px] text-zinc-600">Created just now</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center relative">
        {status === 'Active' ? (
          <button 
            className="px-4 py-2 bg-[#9396C2] hover:bg-[#8C88BA] text-[#170E2A] rounded-xl text-xs font-bold transition-all outline-none cursor-pointer"
          >
            View Live
          </button>
        ) : (
          userRole === 'teacher' && (
            <button 
              className="px-4 py-2 border border-[#FF7AB6]/40 hover:border-[#FF7AB6] text-[#FF7AB6] rounded-xl text-xs font-bold transition-all outline-none cursor-pointer"
            >
              Manage
            </button>
          )
        )}

        {userRole === 'teacher' && (
          <button 
            onClick={handleDropdownToggle}
            className="p-2 hover:bg-zinc-800/40 text-zinc-500 hover:text-white rounded-xl transition-colors outline-none cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>
        )}

        {userRole === 'teacher' && isMenuOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-11 bg-[#110726] border border-zinc-800 rounded-2xl p-2 w-44 shadow-2xl z-40 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <span className="text-[9px] font-black text-zinc-500 tracking-wider uppercase block px-3 py-1 mb-1">
              Action Menu
            </span>

            <button 
              onClick={() => {
                onEdit(evt);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              <Edit3 size={14} className="text-zinc-400" />
              Edit
            </button>

            <button 
              onClick={() => {
                onDuplicate(evt);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              <Copy size={14} className="text-zinc-400" />
              Duplicate
            </button>

            <div className="border-t border-zinc-800/50 my-1" />

            <button 
              onClick={() => {
                onDelete(evt);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 size={14} className="text-rose-400" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}