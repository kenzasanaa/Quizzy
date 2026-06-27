import React from 'react';
import { X, Info, Calendar, Clock } from 'lucide-react';

export default function EditEventModal({
  isOpen,
  editingEvent,
  validationError,
  editTitle,
  setEditTitle,
  editDate,
  setEditDate,
  editTime,
  setEditTime,
  editDesc,
  setEditDesc,
  onClose,
  onDelete,
  onSave
}) {
  if (!isOpen || !editingEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#221630] border border-[#FF7AB6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none cursor-pointer"
        >
          <X size={16} />
        </button>

        <h2 className="text-2xl font-black text-white leading-none">Edit Quiz</h2>

        {validationError && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs py-3 px-4 rounded-xl flex items-start gap-2 animate-pulse">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400">Quiz Title</label>
            <input 
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input 
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input 
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400">Description</label>
            <textarea 
              rows={4}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button 
              type="button"
              onClick={onDelete}
              className="border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:bg-rose-500/5 px-6 py-3 rounded-xl text-sm font-bold transition-all outline-none cursor-pointer"
            >
              Delete Quiz
            </button>
            <button 
              type="button"
              onClick={onSave}
              className="bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-md shadow-[#FF7AB6]/10 outline-none cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}