import React from 'react';
import { Award, MoreVertical, Trash2 } from 'lucide-react';

export default function StudentRow({
  student,
  userRole,
  activeDropdownId,
  setActiveDropdownId,
  onDelete
}) {
  const isMenuOpen = activeDropdownId === student.id;

  return (
    <tr className="text-sm text-zinc-300 hover:bg-white/2 transition-colors group">
      {/* Student Profile Info */}
      <td className="py-4 flex items-center gap-3.5">
        <img 
          src={student.avatar} 
          alt={student.name} 
          className="w-10 h-10 rounded-full object-cover ring-1 ring-[#FF7AB6]/20" 
        />
        <span className="font-bold text-white group-hover:text-[#FF7AB6] transition-colors">
          {student.name}
        </span>
      </td>

      {/* Class tag */}
      <td className="py-4 font-semibold text-zinc-400">{student.class}</td>

      {/* Quizzes Count */}
      <td className="py-4 font-medium text-zinc-400">{student.quizzesTaken}</td>

      {/* Avg Score Badge */}
      <td className="py-4">
        <span className="flex items-center gap-1.5 font-bold text-[#FFB86B]">
          <Award size={14} /> {student.avgScore}%
        </span>
      </td>

      {/* Last active status */}
      <td className="py-4 text-xs font-semibold text-zinc-500">{student.lastActive}</td>

      {/* Delete actions (Hidden for Students) */}
      {userRole === 'teacher' && (
        <td className="py-4 text-right relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdownId(isMenuOpen ? null : student.id);
            }}
            className="p-2 hover:bg-zinc-800/40 text-zinc-500 hover:text-white rounded-xl transition-colors outline-none cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>

          {/* Row action popup card */}
          {isMenuOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-11 bg-[#110726] border border-zinc-800 rounded-2xl p-2 w-36 shadow-2xl z-40"
            >
              <button 
                onClick={() => onDelete(student)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all cursor-pointer text-left"
              >
                <Trash2 size={14} />
                Delete Student
              </button>
            </div>
          )}
        </td>
      )}
    </tr>
  );
}