import React from 'react';
import { X, Info, Mail, ChevronRight } from 'lucide-react';

export default function InviteStudentModal({
  isOpen,
  onClose,
  inviteName,
  setInviteName,
  inviteEmail,
  setInviteEmail,
  inviteClass,
  setInviteClass,
  modalValidationError,
  setModalValidationError,
  onInvite
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#221630] border border-[#FF7AB6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight leading-none text-center sm:text-left">Invite Student</h2>
          <p className="text-zinc-500 text-xs text-center sm:text-left">Send an invite link or register a new student</p>
        </div>

        {modalValidationError && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs py-3 px-4 rounded-xl flex items-start gap-2 animate-pulse">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>{modalValidationError}</span>
          </div>
        )}

        <div className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">Full Name</label>
            <input 
              type="text"
              value={inviteName}
              onChange={(e) => {
                setModalValidationError('');
                setInviteName(e.target.value);
              }}
              placeholder="e.g. John Doe"
              className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none text-sm text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
              <input 
                type="email"
                value={inviteEmail}
                onChange={(e) => {
                  setModalValidationError('');
                  setInviteEmail(e.target.value);
                }}
                placeholder="name@example.com"
                className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-4 outline-none text-sm text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">Class</label>
            <div className="relative">
              <select 
                value={inviteClass}
                onChange={(e) => setInviteClass(e.target.value)}
                className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none text-sm text-white appearance-none cursor-pointer"
              >
                <option value="10A">10A</option>
                <option value="10B">10B</option>
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
            onClick={onInvite}
            className="bg-[#FF7AB6] text-[#1B1026] font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#FF7AB6]/10 outline-none cursor-pointer"
          >
            Invite
          </button>
        </div>

      </div>
    </div>
  );
}