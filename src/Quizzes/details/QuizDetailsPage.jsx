import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit3, Share2, BookOpen, Clock, Users, BarChart2 } from 'lucide-react';


// Shared Layout Components
import Sidebar from '../../DashBord/Sidebar';
import Header from '../../DashBord/Header';

// Local Page Components
import RecentCompletionsTable from './RecentCompletionsTable';
import QuestionPerformance from './QuestionPerformance';
import ShareQuizModal from './ShareQuizModal';

export default function QuizDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'teacher';

  const mockStats = [
    { label: 'Total Completions', value: '28', icon: BookOpen, color: '#FF7AB6' },
    { label: 'Completion Time', value: '12:45', icon: Clock, color: '#FFB86B' },
    { label: 'Average Score', value: '78.5%', icon: Users, color: '#FF7AB6' },
    { label: 'Top Score', value: '95%', icon: BarChart2, color: '#FFD166' }
  ];

  const recentCompletions = [
    { name: 'Alex Johnson', score: '85%', timeSpent: '15:24', completedAt: '2 hours ago' },
    { name: 'Emma Wilson', score: '92%', timeSpent: '18:24', completedAt: '2 hours ago' },
    { name: 'Michael Cohen', score: '92%', timeSpent: '18:24', completedAt: '2 hours ago' },
    { name: 'Sophia Garcia', score: '92%', timeSpent: '18:24', completedAt: '2 hours ago' }
  ];

  const questionsPerformance = [
    { question: 'What is the basic unit of life?', successRate: 92 },
    { question: 'Which organelle is responsible for...?', successRate: 92 },
    { question: 'What is the process of cell division...?', successRate: 92 },
    { question: 'Which of the following is NOT a...?', successRate: 92 },
    { question: 'What is the main function of mito...?', successRate: 92 }
  ];

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="quizzes" navigate={navigate} />
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 p-6 z-50 transform transition-transform duration-300 lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          activeTab="quizzes" 
          isMobile 
          onClose={() => setIsMobileSidebarOpen(false)} 
          navigate={navigate} 
        />
      </aside>

      {/* CONTENT PANEL */}
      <div className="grow flex flex-col min-h-screen min-w-0">
        
        <Header 
          userRole={userRole} 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
          onCreateQuiz={() => navigate('/create-quiz')} 
        />

        {/* PAGE BODY */}
        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          {/* Header Block with controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
            <button 
              onClick={() => navigate(`/quizzes/${id}/play`)}
              className="px-5 py-2.5 bg-[#9396C2] hover:bg-[#8C88BA] text-[#170E2A] rounded-xl text-xs font-bold"
            >
              Preview
            </button>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">Introduction to Biology</h1>
                <p className="text-zinc-400 text-xs sm:text-sm">Basic concepts of biology for beginners</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => alert("Editing quiz...")}
                className="px-4 py-2.5 border border-zinc-800 hover:border-[#FF7AB6]/30 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all bg-[#170E2A]/40 cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit
              </button>
              
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2.5 border border-zinc-800 hover:border-[#FF7AB6]/30 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all bg-[#170E2A]/40 cursor-pointer flex items-center gap-1.5"
              >
                <Share2 size={14} /> Share
              </button>

              <button 
                onClick={() => alert("Starting preview mode...")}
                className="px-5 py-2.5 bg-[#FF7AB6] hover:bg-[#FF7AB6] text-[#170E2A] rounded-xl text-xs font-bold transition-all outline-none cursor-pointer"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Metrics Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="bg-[#251836]/80 border border-[#FF7AB6]/5 p-5 rounded-2xl flex items-center justify-between shadow-md">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-zinc-400 block">{stat.label}</span>
                    <span className="text-2xl font-black text-white block leading-tight">{stat.value}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1B1026]/50 border border-[#FF7AB6]/10" style={{ color: stat.color }}>
                    <IconComp size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Primary View Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RecentCompletionsTable completions={recentCompletions} />
            </div>
            <div className="lg:col-span-5">
              <QuestionPerformance questions={questionsPerformance} />
            </div>
          </div>

          {/* Bottom Banner share callout */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white leading-tight">Share This Quiz</h3>
              <p className="text-zinc-400 text-xs">Share this quiz with students or colleagues</p>
            </div>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="bg-[#FF7AB6] hover:bg-[#FF7AB6] text-[#170E2A] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-[#9396C2]/10 cursor-pointer outline-none w-max"
            >
              <Share2 size={14} /> Share Quiz
            </button>
          </div>

        </div>
      </div>

      {/* PopUp overlay Share components */}
      <ShareQuizModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl="https://quizmaster.com/quizzes/q1"
      />

    </div>
  );
}