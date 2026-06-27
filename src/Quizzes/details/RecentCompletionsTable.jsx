import React from 'react';

export default function RecentCompletionsTable({ completions = [] }) {
  return (
    <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl h-full">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/40">
        <div className="space-y-0.5">
          <h3 className="text-lg font-black text-white">Recent Completions</h3>
          <p className="text-zinc-400 text-xs">Students who recently completed this quiz</p>
        </div>
        <button 
          onClick={() => alert("Showing all completions...")}
          className="px-4 py-2 border border-zinc-800 hover:border-[#FF7AB6]/40 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all bg-[#170E2A]/40 cursor-pointer"
        >
          View All Results
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-zinc-800/50 text-xs font-bold text-zinc-500">
              <th className="pb-4 pt-2">Student</th>
              <th className="pb-4 pt-2">Score</th>
              <th className="pb-4 pt-2">Time Spent</th>
              <th className="pb-4 pt-2">Completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {completions.map((student, idx) => (
              <tr key={idx} className="text-sm text-zinc-300 hover:bg-white/2 transition-colors">
                <td className="py-4 font-bold text-white">{student.name}</td>
                <td className="py-4 font-bold text-[#FFB86B]">{student.score}</td>
                <td className="py-4 text-zinc-400 font-medium">{student.timeSpent}</td>
                <td className="py-4 text-xs text-zinc-500 font-semibold">{student.completedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}