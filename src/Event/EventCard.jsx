import React from 'react';
import { Calendar, Clock, Users, BookOpen, MoreVertical } from 'lucide-react';

export default function EventCard({ evt, onManage, onDropdownClick, isDropdownOpen, dropdownRef, onEdit, onDuplicate, onDelete }) {
  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
      live: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      past: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25'
    };
    return (
      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles[status] || styles.upcoming}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-xl sm:rounded-2xl hover:border-[#FF7AB6]/20 transition-all group">
      {/* Icon */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[#2D1B3D] border border-[#FF7AB6]/10 shrink-0">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7AB6]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-sm text-white truncate">{evt.title}</h3>
          {getStatusBadge(evt.status)}
        </div>
        <p className="text-xs text-zinc-400 truncate mb-2 hidden sm:block">{evt.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {evt.questions} questions
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {evt.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {evt.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {evt.participants} participants
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
        <button
          onClick={() => onManage(evt)}
          className="px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl border border-[#FF7AB6]/30 text-[#FF7AB6] hover:bg-[#FF7AB6] hover:text-[#1B1026] hover:border-[#FF7AB6] transition-all"
        >
          Manage
        </button>

        <div className="relative" ref={isDropdownOpen ? dropdownRef : null}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDropdownClick(evt.id);
            }}
            className="p-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#2D1B3D] border border-[#FF7AB6]/10 rounded-xl shadow-2xl shadow-black/40 py-1.5 z-20 overflow-hidden">
              <div className="px-3 py-2 border-b border-zinc-700/50 mb-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Action Menu</p>
              </div>
              <button
                onClick={() => onEdit(evt)}
                className="w-full px-4 py-2 text-left text-xs text-zinc-300 hover:bg-[#FF7AB6]/10 hover:text-white flex items-center gap-2.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => onDuplicate(evt)}
                className="w-full px-4 py-2 text-left text-xs text-zinc-300 hover:bg-[#FF7AB6]/10 hover:text-white flex items-center gap-2.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5" /> Duplicate
              </button>
              <div className="my-1 border-t border-zinc-700/50" />
              <button
                onClick={() => onDelete(evt.id)}
                className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center">✕</span> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}