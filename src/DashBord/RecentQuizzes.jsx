import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';

export default function RecentQuizzes({ 
  quizzesList = [], 
  userRole, 
  onGetQuizScheduleStatus, 
  onCreateQuiz 
}) {
  return (
    <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 sm:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-black text-white">Recent Quizzes</h3>
        <p className="text-zinc-400 text-xs mt-0.5">Your recently created quizzes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quizzesList.slice(-3).reverse().map((quiz, idx) => {
          const scheduleStatus = onGetQuizScheduleStatus(quiz.title);
          const isUnscheduled = scheduleStatus === "Not scheduled";

          return (
            <div key={quiz.id || idx} className="bg-[#1B1026]/80 border border-zinc-800/60 p-8 rounded-2xl flex flex-col justify-between h-52 hover:border-[#FF7AB6]/30 transition-all group">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-white leading-snug group-hover:text-[#FF7AB6] transition-colors">
                  {quiz.title}
                </h4>
                <ChevronRight size={16} className="text-zinc-500 group-hover:text-[#FF7AB6] transition-all shrink-0" />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span>{quiz.questions} questions</span>
                  <span>{quiz.completions} completions</span>
                </div>

                <div className="text-[11px] font-bold">
                  {isUnscheduled ? (
                    <span className="text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded-md inline-block">
                      Not scheduled
                    </span>
                  ) : (
                    <span className="text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block truncate max-w-full">
                      Scheduled: {scheduleStatus}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-zinc-400">Completion Rate</span>
                    <span className="text-[#FF7AB6]">{quiz.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] rounded-full" 
                      style={{ width: `${quiz.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {userRole === 'teacher' && (
          <button 
            onClick={onCreateQuiz}
            className="border-2 border-dashed border-zinc-800 hover:border-[#FF7AB6]/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-52 gap-3 group transition-all outline-none w-full cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-[#1B1026] border border-zinc-800 text-zinc-500 group-hover:text-[#FF7AB6] group-hover:border-[#FF7AB6]/30 transition-all">
              <Plus size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-300 group-hover:text-white transition-colors">Create New Quiz</h4>
              <p className="text-[10px] text-zinc-500 leading-snug max-w-[150px] mx-auto mt-0.5">
                Add questions, set time limits and more
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}