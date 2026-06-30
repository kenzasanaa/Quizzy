import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, BookOpen, Users, Clock, BarChart3 } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'teacher';
  const [teacherName] = useState('John');

  // Load quizzes from localStorage
  const [quizzes, setQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem('quizzesList');
      if (saved) return JSON.parse(saved);
    } catch {
      console.warn('Failed to parse quizzes');
    }
    return [
      {
        id: 1782575637939,
        title: 'fghghfhg',
        questions: 7,
        completions: 0,
        scheduled: false,
        completionRate: 0,
        category: 'Science'
      },
      {
        id: 1782575637937,
        title: 'Introduction to Biology',
        questions: 15,
        completions: 28,
        scheduled: false,
        completionRate: 85,
        category: 'Science'
      },
      {
        id: 1782575637938,
        title: 'Introduction to Biology',
        questions: 15,
        completions: 28,
        scheduled: false,
        completionRate: 92,
        category: 'Science'
      }
    ];
  });

  // Metrics
  const totalQuizzes = quizzes.length;
  const totalCompletions = quizzes.reduce((sum, q) => sum + (q.completions || 0), 0);
  const avgCompletionRate = totalQuizzes > 0
    ? Math.round(quizzes.reduce((sum, q) => sum + (q.completionRate || 0), 0) / totalQuizzes)
    : 0;

  const handleCreateQuiz = () => navigate('/create-quiz');

  // Navigate to quiz details when clicking a quiz card
  const handleQuizClick = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="dashboard" navigate={navigate} />
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 p-6 z-50 transform transition-transform duration-300 lg:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar activeTab="dashboard" isMobile onClose={() => setIsMobileSidebarOpen(false)} navigate={navigate} />
      </aside>

      {/* Content Panel */}
      <div className="grow flex flex-col min-h-screen min-w-0">
        
        <Header 
          userRole={userRole} 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
          onCreateQuiz={handleCreateQuiz} 
        />

        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          {/* Welcome Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard</h1>
            <p className="text-zinc-400 text-sm">
              Welcome back, {teacherName}! Here's what's happening with your quizzes
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={BookOpen}
              label="Total Quizzes"
              value={totalQuizzes}
              color="from-[#FF7AB6] to-[#FFB86B]"
            />
            <StatCard
              icon={Users}
              label="Total Completions"
              value={totalCompletions}
              color="from-emerald-400 to-emerald-600"
            />
            <StatCard
              icon={BarChart3}
              label="Avg. Completion Rate"
              value={`${avgCompletionRate}%`}
              color="from-violet-400 to-violet-600"
            />
          </div>

          {/* Recent Quizzes Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">Recent Quizzes</h2>
              <p className="text-zinc-400 text-xs">Your recently created quizzes</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quizzes.slice(0, 3).map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onClick={() => handleQuizClick(quiz.id)}
                />
              ))}

              {/* Create New Quiz Card */}
              <button
                onClick={handleCreateQuiz}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-[#251836]/40 border border-dashed border-[#FF7AB6]/20 rounded-2xl hover:border-[#FF7AB6]/40 hover:bg-[#251836]/60 transition-all group min-h-[200px]"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#2D1B3D] border border-[#FF7AB6]/10 group-hover:border-[#FF7AB6]/30 transition-colors">
                  <Plus className="w-5 h-5 text-[#FF7AB6]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Create New Quiz</p>
                  <p className="text-xs text-zinc-500 mt-1">Add questions, set time limits and more</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

/* Quiz Card Component — CLICKABLE */
function QuizCard({ quiz, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-2xl p-5 space-y-4 hover:border-[#FF7AB6]/30 hover:bg-[#251836] transition-all cursor-pointer group"
    >
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-[#FF7AB6] transition-colors">
          {quiz.title}
        </h3>
        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#FF7AB6] transition-colors" />
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {quiz.questions} questions
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {quiz.completions} completions
        </span>
      </div>

      {/* Status Badge */}
      <div>
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
          quiz.scheduled
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
        }`}>
          {quiz.scheduled ? 'Scheduled' : 'Not scheduled'}
        </span>
      </div>

      {/* Completion Rate Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">Completion Rate</span>
          <span className="text-[#FF7AB6] font-bold">{quiz.completionRate || 0}%</span>
        </div>
        <div className="w-full h-2 bg-[#1B1026] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] rounded-full transition-all"
            style={{ width: `${quiz.completionRate || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}