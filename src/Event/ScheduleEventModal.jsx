import React from 'react';
import { X, Info, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function ScheduleEventModal({
  isOpen,
  onClose,
  quizzesList = [],
  scheduleEventQuizId,
  setScheduleEventQuizId,
  scheduleEventDate,
  setScheduleEventDate,
  scheduleEventTime,
  setScheduleEventTime,
  scheduleEventAvailability,
  setScheduleEventAvailability,
  modalValidationError,
  setModalValidationError,
  onSchedule
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#221630] border border-[#FBB9A6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight leading-none text-center sm:text-left">Schedule Event</h2>
          <p className="text-zinc-500 text-xs text-center sm:text-left">Create and schedule a new quiz event</p>
        </div>

        {modalValidationError && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs py-3 px-4 rounded-xl flex items-start gap-2 animate-pulse">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>{modalValidationError}</span>
          </div>
        )}

        <div className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">Quiz</label>
            <div className="relative">
              <select 
                value={scheduleEventQuizId}
                onChange={(e) => {
                  setModalValidationError('');
                  setScheduleEventQuizId(e.target.value);
                }}
                className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 px-4 outline-none text-sm text-white appearance-none cursor-pointer"
              >
                <option value="">Select a quiz</option>
                {quizzesList.map(q => (
                  <option key={q.id} value={q.id}>{q.title}</option>
                ))}
              </select>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">When?</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input 
                  type="date"
                  value={scheduleEventDate}
                  onChange={(e) => {
                    setModalValidationError('');
                    setScheduleEventDate(e.target.value);
                  }}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 pl-10 pr-4 outline-none text-sm text-white"
                />
              </div>

              <div className="relative">
                <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input 
                  type="time"
                  value={scheduleEventTime}
                  onChange={(e) => {
                    setModalValidationError('');
                    setScheduleEventTime(e.target.value);
                  }}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 pl-10 pr-4 outline-none text-sm text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">Availability</label>
            <div className="relative">
              <select 
                value={scheduleEventAvailability}
                onChange={(e) => setScheduleEventAvailability(e.target.value)}
                className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 px-4 outline-none text-sm text-white appearance-none cursor-pointer"
              >
                <option value="Only visible to invited students">Only visible to invited students</option>
                <option value="Public to everyone">Public to everyone</option>
              </select>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all outline-none cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={onSchedule}
            className="bg-[#9396C2] hover:bg-[#8C88BA] text-[#170E2A] font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#9396C2]/20 outline-none cursor-pointer"
          >
            Schedule
          </button>
        </div>

      </div>
    </div>
  );
}