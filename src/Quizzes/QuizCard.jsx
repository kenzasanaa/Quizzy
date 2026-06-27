import React from 'react';
import { BookOpen, Clock, Users, MoreVertical, Edit3, Copy, Send, CheckCircle, Share2, Trash2 } from 'lucide-react';

export default function QuizCard({
  quiz,
  activeDropdownId,
  setActiveDropdownId,
  onPlay,       // Triggers when clicking "View" button
  onDetails,    // Triggers when clicking the quiz title text link
  onEdit,
  onDuplicate,
  onTogglePublish,
  onShare,
  onDelete
}) {
  const isMenuOpen = activeDropdownId === quiz.id;

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setActiveDropdownId(isMenuOpen ? null : quiz.id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Unpublished':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Draft':
        return 'bg-[#FFB86B]/10 text-[#FFB86B] border border-[#FFB86B]/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <div className="p-4 rounded-2xl border bg-[#1B1026]/60 border-zinc-800/40 hover:border-[#FF7AB6]/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
      <div className="flex items-start gap-4 min-w-0">
        
        <div className="p-3.5 rounded-xl border shrink-0 bg-[#170E2A] text-[#9396C2] border-[#9396C2]/10">
          <BookOpen size={18} />
        </div>

        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Clickable Quiz Title Link */}
            <h4 
              onClick={() => onDetails(quiz)}
              className="font-bold text-sm text-white truncate hover:text-[#FF7AB6] transition-all cursor-pointer underline-offset-2 hover:underline"
            >
              {quiz.title}
            </h4>

            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(quiz.status)}`}>
              {quiz.status}
            </span>
          </div>

          <p className="text-zinc-400 text-xs truncate max-w-sm sm:max-w-md">
            {quiz.description || "Basic concepts of biology for beginners"}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen size={12} /> {quiz.questions} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {quiz.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {quiz.completions} completions
            </span>
            <span className="text-[10px] text-zinc-600">Created just now</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center relative">
        {/* View button calls the onPlay function */}
        <button 
          onClick={() => onPlay(quiz)} 
          className="px-5 py-2 border border-zinc-800 hover:border-[#FF7AB6]/40 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all bg-[#170E2A]/40 cursor-pointer"
        >
          View
        </button>

        <button 
          onClick={handleDropdownToggle}
          className="p-2 hover:bg-zinc-800/40 text-zinc-500 hover:text-white rounded-xl transition-colors outline-none cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>

        {/* Dropdown Action Menu */}
        {isMenuOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-11 bg-[#110726] border border-zinc-800/80 rounded-2xl p-2 w-44 shadow-2xl z-40 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <span className="text-[9px] font-black text-zinc-500 tracking-wider uppercase block px-3 py-1 mb-1">
              Action Menu
            </span>

            <button 
              onClick={() => {
                onEdit(quiz);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer text-left"
            >
              <Edit3 size={14} className="text-zinc-400" />
              Edit
            </button>

            <button 
              onClick={() => {
                onDuplicate(quiz);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer text-left"
            >
              <Copy size={14} className="text-zinc-400" />
              Duplicate
            </button>

            <button 
              onClick={() => {
                onTogglePublish(quiz);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer text-left"
            >
              {quiz.status === 'Published' ? (
                <>
                  <Send size={14} className="text-zinc-400" />
                  Unpublish
                </>
              ) : (
                <>
                  <CheckCircle size={14} className="text-zinc-400" />
                  Publish
                </>
              )}
            </button>

            <button 
              onClick={() => {
                onShare(quiz);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer text-left"
            >
              <Share2 size={14} className="text-zinc-400" />
              Share
            </button>

            <div className="border-t border-zinc-800/50 my-1" />

            <button 
              onClick={() => {
                onDelete(quiz);
                setActiveDropdownId(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all cursor-pointer text-left"
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