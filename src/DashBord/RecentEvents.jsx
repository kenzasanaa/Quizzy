import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDisplayTime } from './dateHelpers';

export default function RecentEvents({ 
  eventsList = [], 
  userRole, 
  onManageEvent 
}) {
  return (
    <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 sm:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-black text-white">Recent Events</h3>
        <p className="text-zinc-400 text-xs mt-0.5">Manage your upcoming and active quiz events</p>
      </div>

      <div className="space-y-3">
        {eventsList.slice(-3).reverse().map((evt) => (
          <div key={evt.id} className="bg-[#1B1026]/60 border border-zinc-800/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border shrink-0 ${evt.isLive ? 'bg-[#FF7AB6]/15 text-[#FF7AB6] border-[#FF7AB6]/20' : 'bg-[#FFB86B]/15 text-[#FFB86B] border-[#FFB86B]/20'}`}>
                <Calendar size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white leading-tight">{evt.title}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                  <span>{formatDisplayTime(evt.time)}</span>
                  <span className="text-zinc-600 hidden sm:inline">•</span>
                  <span>{evt.participants}</span>
                </div>
              </div>
            </div>

            {userRole === 'teacher' && (
              <button 
                onClick={() => onManageEvent(evt)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all outline-none border border-[#FF7AB6]/40 hover:border-[#FF7AB6] text-[#FF7AB6] cursor-pointer text-center"
              >
                Manage
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}