import React, { useState } from 'react';
import { X, ChevronLeft, Copy, Check } from 'lucide-react';

export default function ShareQuizModal({ isOpen, onClose, shareUrl = 'https://quizmaster.com/quizzes/q1' }) {
  const [copied, setCopied] = useState(false);
  const [trackShares, setTrackShares] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#221630] border border-[#FF7AB6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Absolute Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header Block */}
        <div className="flex items-start gap-4">
          <button 
            onClick={onClose}
            className="p-2.5 bg-[#170E2A]/60 border border-zinc-800/80 hover:border-[#FF7AB6]/30 rounded-xl text-zinc-400 hover:text-white transition-all outline-none cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">Share Quiz</h2>
            <p className="text-zinc-500 text-xs">Share this quiz with students, colleagues, or on social media</p>
          </div>
        </div>

        {/* Inputs & Configurations */}
        <div className="space-y-5">
          
          {/* Share Link block */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">Share Link</label>
            <div className="flex items-center gap-2">
              <input 
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none text-sm text-zinc-300"
              />
              <button 
                onClick={handleCopy}
                className="p-3 bg-[#1B1026] border border-zinc-800 hover:border-[#FF7AB6]/30 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer outline-none shrink-0"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* QR Code Container styled exactly to mock */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">QR Code</label>
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-zinc-100">
              
              {/* Clean vector custom QR Graphic wrapper */}
              <svg className="w-28 h-28 text-[#1B1026]" viewBox="0 0 100 100" fill="currentColor">
                {/* Outter Finder Top Left */}
                <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                {/* Outter Finder Top Right */}
                <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                {/* Outter Finder Bottom Left */}
                <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                {/* Center / Random data matrix alignment blocks */}
                <rect x="40" y="5" width="10" height="15" />
                <rect x="55" y="15" width="10" height="10" />
                <rect x="45" y="35" width="20" height="10" />
                <rect x="5" y="45" width="15" height="10" />
                <rect x="80" y="45" width="10" height="15" />
                <rect x="40" y="70" width="10" height="10" />
                <rect x="55" y="80" width="15" height="15" />
                <rect x="80" y="80" width="10" height="10" />
                <rect x="85" y="70" width="10" height="5" />
              </svg>

              <button 
                onClick={() => alert("Downloading QR code...")}
                className="px-4 py-2 bg-transparent hover:bg-zinc-100 text-[#1B1026] border border-zinc-300 rounded-xl text-xs font-bold transition-all outline-none cursor-pointer"
              >
                Download QR Code
              </button>
            </div>
          </div>

          {/* Track Shares toggle switch */}
          <div className="flex items-center justify-between py-3 border-y border-zinc-800/40">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white block">Track Shares</span>
              <span className="text-zinc-500 text-xs block">Get notified when someone accesses this link</span>
            </div>
            
            {/* Sunset pastel toggle switch */}
            <button 
              onClick={() => setTrackShares(!trackShares)}
              className={`w-11 h-6 rounded-full transition-all outline-none cursor-pointer relative ${trackShares ? 'bg-[#FF7AB6]' : 'bg-zinc-800'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all transform ${trackShares ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/20">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all outline-none cursor-pointer"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={handleCopy}
            className="bg-[#FF7AB6] hover:bg-[#FF7AB6] text-[#170E2A] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-[#9396C2]/10 cursor-pointer outline-none"
          >
            <Copy size={14} /> Copy Link
          </button>
        </div>

      </div>
    </div>
  );
}