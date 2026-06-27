import React from 'react';

export default function QuestionPerformance({ questions = [] }) {
  return (
    <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl h-full">
      <div className="space-y-0.5 pb-4 border-b border-zinc-800/40">
        <h3 className="text-lg font-black text-white">Question Performance</h3>
        <p className="text-zinc-400 text-xs">How students performed on each question</p>
      </div>

      <div className="space-y-5">
        {questions.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-start gap-3 text-xs sm:text-sm font-semibold text-zinc-300">
              <span className="truncate">{idx + 1}. {item.question}</span>
              <span className="text-[#FFB86B] shrink-0">{item.successRate}%</span>
            </div>
            
            {/* Custom Sunset Pastels Progress Bar */}
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] rounded-full transition-all duration-500"
                style={{ width: `${item.successRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}