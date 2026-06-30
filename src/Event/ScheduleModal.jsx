import React from 'react';
import { X, BookOpen, Calendar, Clock, ChevronDown, AlertCircle } from 'lucide-react';

export default function ScheduleModal({
  isOpen,
  onClose,
  isEditing,
  quizzesList,
  selectedQuizId,
  onQuizChange,
  eventDate,
  onDateChange,
  eventTime,
  onTimeChange,
  availability,
  onAvailabilityChange,
  error,
  onSchedule
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#251836] border border-[#FF7AB6]/15 rounded-2xl lg:rounded-3xl shadow-2xl shadow-black/50 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🍳</span>
            <span className="text-lg font-black bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] bg-clip-text text-transparent">Quizzy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isEditing ? 'Edit Event' : 'Schedule Event'}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">Create and schedule a new quiz event</p>
        </div>

        <div className="space-y-5">
          {/* Quiz Select */}
          <FormField label="Quiz" icon={BookOpen}>
            <select
              value={selectedQuizId}
              onChange={(e) => onQuizChange(e.target.value)}
              className="w-full appearance-none pl-10 pr-10 py-3 bg-[#1B1026] border border-[#FF7AB6]/15 rounded-xl text-sm text-white outline-none focus:border-[#FF7AB6]/50 transition-colors cursor-pointer"
            >
              <option value="">Select a quiz</option>
              {quizzesList.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </FormField>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">When?</label>
            <div className="grid grid-cols-2 gap-3">
              <FormField icon={Calendar}>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#1B1026] border border-[#FF7AB6]/15 rounded-xl text-sm text-white outline-none focus:border-[#FF7AB6]/50 transition-colors"
                />
              </FormField>
              <FormField icon={Clock}>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#1B1026] border border-[#FF7AB6]/15 rounded-xl text-sm text-white outline-none focus:border-[#FF7AB6]/50 transition-colors"
                />
              </FormField>
            </div>
          </div>

          {/* Availability */}
          <FormField label="Availability">
            <select
              value={availability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="w-full appearance-none px-4 pr-10 py-3 bg-[#1B1026] border border-[#FF7AB6]/15 rounded-xl text-sm text-white outline-none focus:border-[#FF7AB6]/50 transition-colors cursor-pointer"
            >
              <option>Only visible to invited students</option>
              <option>Visible to all students</option>
              <option>Public link</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </FormField>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-zinc-700 text-white font-semibold text-sm hover:border-zinc-500 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSchedule}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-[#FF7AB6]/10"
          >
            {isEditing ? 'Save Changes' : 'Schedule'}
          </button>
        </div>

      </div>
    </div>
  );
}

function FormField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-bold text-white">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF7AB6]" />}
        {children}
      </div>
    </div>
  );
}