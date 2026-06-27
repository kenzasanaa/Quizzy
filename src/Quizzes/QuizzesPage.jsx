import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Shared Layout Components (siblings of Quizzes folder)
import Sidebar from '../DashBord/Sidebar';
import Header from '../DashBord/Header';

// Local Page Components
import QuizFilters from './QuizFilters';
import QuizCard from './QuizCard';

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState('All Quizzes'); // 'All Quizzes', 'Published', 'Drafts'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Track active popup menu dropdown ID
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const userRole = localStorage.getItem('userRole') || 'teacher';

  const [quizzesList, setQuizzesList] = useState(() => {
    const saved = localStorage.getItem('quizzesList');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: 'Introduction to Biology',
        status: 'Published',
        questions: 15,
        duration: '20 min',
        completions: 32,
        category: 'Science',
        description: 'Basic concepts of biology for beginners'
      },
      {
        id: 2,
        title: 'Advanced Mathematics',
        status: 'Unpublished',
        questions: 15,
        duration: '20 min',
        completions: 32,
        category: 'Mathematics',
        description: 'Basic concepts of biology for beginners'
      },
      {
        id: 3,
        title: 'Chemistry Fundamentals',
        status: 'Draft',
        questions: 15,
        duration: '20 min',
        completions: 32,
        category: 'Chemistry',
        description: 'Basic concepts of biology for beginners'
      }
    ];
  });

  // Global click listener to dismiss Action Menus automatically
  useEffect(() => {
    const closeDropdowns = () => setActiveDropdownId(null);
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('quizzesList', JSON.stringify(quizzesList));
  }, [quizzesList]);

  // --- NAVIGATION HANDLERS ---
  const handlePlayQuiz = (quiz) => {
    navigate(`/quizzes/${quiz.id}/play`); 
  };

  const handleViewDetails = (quiz) => {
    navigate(`/quizzes/${quiz.id}`); 
  };

  // --- CRUD ACTION HANDLERS ---
  const handleActionEdit = (quiz) => {
    const newTitle = prompt("Edit Quiz Title:", quiz.title);
    if (newTitle && newTitle.trim()) {
      setQuizzesList(quizzesList.map(q => q.id === quiz.id ? { ...q, title: newTitle } : q));
    }
  };

  const handleActionDuplicate = (quiz) => {
    const duplicated = {
      ...quiz,
      id: Date.now(),
      title: `${quiz.title} (Copy)`,
      completions: 0
    };
    setQuizzesList([duplicated, ...quizzesList]);
  };

  const handleActionTogglePublish = (quiz) => {
    const nextStatus = quiz.status === 'Published' ? 'Unpublished' : 'Published';
    setQuizzesList(quizzesList.map(q => q.id === quiz.id ? { ...q, status: nextStatus } : q));
  };

  const handleActionShare = (quiz) => {
    alert(`Invite Link generated for "${quiz.title}"!`);
  };

  const handleActionDelete = (quiz) => {
    if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      setQuizzesList(quizzesList.filter(q => q.id !== quiz.id));
    }
  };

  const handleCreateQuizRedirect = () => {
    navigate('/create-quiz');
  };

  // Filter evaluation logic
  const filteredQuizzes = quizzesList.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || quiz.category === selectedCategory;
    
    const matchesTab = 
      activeTab === 'All Quizzes' ? true :
      activeTab === 'Published' ? quiz.status === 'Published' :
      activeTab === 'Drafts' ? quiz.status === 'Draft' : true;

    return matchesSearch && matchesCategory && matchesTab;
  });

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
          onCreateQuiz={handleCreateQuizRedirect} 
        />

        {/* PAGE BODY */}
        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Quizzes</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Create, manage and analyze your quizzes</p>
            </div>
            
            {userRole === 'teacher' && (
              <button 
                onClick={handleCreateQuizRedirect}
                className="bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max cursor-pointer"
              >
                <Plus size={16} /> Create New Quiz
              </button>
            )}
          </div>

          {/* Quiz Library layout matches style mocks */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="space-y-0.5">
              <h3 className="text-lg font-black text-white">Quiz Library</h3>
              <p className="text-zinc-400 text-xs">Browse and manage all your quizzes</p>
            </div>

            <QuizFilters 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              quizzesList={quizzesList}
            />

            {/* Render List */}
            <div className="space-y-4">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-semibold">
                  No quizzes found matching the selected filter.
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <QuizCard 
                    key={quiz.id}
                    quiz={quiz}
                    activeDropdownId={activeDropdownId}
                    setActiveDropdownId={setActiveDropdownId}
                    onPlay={handlePlayQuiz}
                    onDetails={handleViewDetails} // Defined here
                    onEdit={handleActionEdit}
                    onDuplicate={handleActionDuplicate}
                    onTogglePublish={handleActionTogglePublish}
                    onShare={handleActionShare}
                    onDelete={handleActionDelete}
                  />
                ))
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}