import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Clock, Users, Search, ChevronDown, MoreVertical, Play, BarChart3, Copy, Share2, Trash2, Edit3, Eye } from 'lucide-react';
import Sidebar from '../DashBord/Sidebar';
import Header from '../DashBord/Header';

export default function QuizzesPage() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Quizzes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const userRole = localStorage.getItem('userRole') || 'teacher';

  const defaultQuizzes = [
    {
      id: 1782575637937,
      title: 'Introduction to Biology',
      status: 'Published',
      questions: 15,
      duration: '20 min',
      completions: 28,
      category: 'Science',
      description: 'Basic concepts of biology for beginners'
    },
    {
      id: 1782575637938,
      title: 'Introduction to Biology',
      status: 'Unpublished',
      questions: 15,
      duration: '20 min',
      completions: 28,
      category: 'Science',
      description: 'Basic concepts of biology for beginners'
    },
    {
      id: 1782575637939,
      title: 'fghghfhg',
      status: 'Published',
      questions: 7,
      duration: '10 min',
      completions: 0,
      category: 'Science',
      description: 'Basic concepts of biology for beginners'
    }
  ];

  const [quizzesList, setQuizzesList] = useState(() => {
    try {
      const saved = localStorage.getItem('quizzesList');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : defaultQuizzes;
      }
    } catch {
      console.warn('Failed to parse quizzes from localStorage');
    }
    return defaultQuizzes;
  });

  useEffect(() => {
    localStorage.setItem('quizzesList', JSON.stringify(quizzesList));
  }, [quizzesList]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdownId(null);
      }
    };
    if (activeDropdownId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDropdownId]);

  const handlePlayQuiz = (quizId) => {
    navigate(`/quizzes/${quizId}/play`);
  };

  const handleViewDetails = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  const handleCreateQuizRedirect = () => {
    navigate('/create-quiz');
  };

  const handleEdit = (quiz) => {
    const newTitle = prompt('Edit Quiz Title:', quiz.title);
    if (newTitle?.trim()) {
      setQuizzesList(prev => prev.map(q => q.id === quiz.id ? { ...q, title: newTitle.trim() } : q));
    }
  };

  const handleDuplicate = (quiz) => {
    const duplicated = {
      ...quiz,
      id: Date.now(),
      title: `${quiz.title} (Copy)`,
      completions: 0,
      status: 'Draft'
    };
    setQuizzesList(prev => [duplicated, ...prev]);
  };

  const handleTogglePublish = (quiz) => {
    const nextStatus = quiz.status === 'Published' ? 'Unpublished' : 'Published';
    setQuizzesList(prev => prev.map(q => q.id === quiz.id ? { ...q, status: nextStatus } : q));
  };

  const handleShare = (quiz) => {
    const link = `${window.location.origin}/quizzes/${quiz.id}/play`;
    navigator.clipboard.writeText(link).then(() => {
      alert(`Invite link copied to clipboard!\n${link}`);
    }).catch(() => {
      alert(`Invite Link generated for "${quiz.title}"!\n${link}`);
    });
  };

  const handleDelete = (quiz) => {
    if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      setQuizzesList(prev => prev.filter(q => q.id !== quiz.id));
    }
  };

  const categories = ['All Categories', ...new Set(quizzesList.map(q => q.category))];

  const filteredQuizzes = quizzesList.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || quiz.category === selectedCategory;
    const matchesTab = activeTab === 'All Quizzes' ? true :
                       activeTab === 'Published' ? quiz.status === 'Published' :
                       activeTab === 'Drafts' ? quiz.status === 'Draft' : true;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      Unpublished: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
      Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/25'
    };
    return (
      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles[status] || styles.Draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="quizzes" navigate={navigate} />
      </aside>

      {/* MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
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
        <div className="grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">Quizzes</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Create, manage and analyze your quizzes</p>
            </div>
            
            {userRole === 'teacher' && (
              <button 
                onClick={handleCreateQuizRedirect}
                className="bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max cursor-pointer"
              >
                <Plus size={16} /> Create New Quiz
              </button>
            )}
          </div>

          {/* Quiz Library Card */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-xl">
            
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-black text-white">Quiz Library</h3>
              <p className="text-zinc-400 text-xs">Browse and manage all your quizzes</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex gap-1 bg-[#1B1026] p-1 rounded-xl w-max overflow-x-auto">
                {['All Quizzes', 'Published', 'Drafts'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-[#FF7AB6] text-[#1B1026]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search & Category */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl text-xs text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40 w-full sm:w-48 lg:w-56"
                  />
                </div>
                <div className="relative shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none px-3 sm:px-4 py-2.5 pr-10 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl text-xs text-white outline-none focus:border-[#FF7AB6]/40 cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quiz List */}
            <div className="space-y-3">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No quizzes found</p>
                  <p className="text-xs mt-1">Try adjusting your filters or create a new quiz.</p>
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#1B1026]/60 border border-[#FF7AB6]/5 rounded-xl sm:rounded-2xl hover:border-[#FF7AB6]/20 transition-all group"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[#2D1B3D] border border-[#FF7AB6]/10 shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7AB6]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 
                          className="font-bold text-sm text-white truncate cursor-pointer hover:text-[#FF7AB6] transition-colors"
                          onClick={() => handleViewDetails(quiz.id)}
                        >
                          {quiz.title}
                        </h3>
                        {getStatusBadge(quiz.status)}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mb-2 hidden sm:block">{quiz.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {quiz.questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {quiz.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {quiz.completions} completions
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                      <button
                        onClick={() => handlePlayQuiz(quiz.id)}
                        className="px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-700 text-white hover:bg-[#FF7AB6] hover:border-[#FF7AB6] hover:text-[#1B1026] transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View
                      </button>

                      <button
                        onClick={() => handleViewDetails(quiz.id)}
                        className="p-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all hidden sm:flex"
                        title="Details & Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>

                      <div className="relative" ref={activeDropdownId === quiz.id ? dropdownRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === quiz.id ? null : quiz.id);
                          }}
                          className="p-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeDropdownId === quiz.id && (
                          <div className="absolute right-0 top-full mt-2 w-44 bg-[#2D1B3D] border border-[#FF7AB6]/10 rounded-xl shadow-2xl shadow-black/40 py-1.5 z-20 overflow-hidden">
                            <div className="px-3 py-2 border-b border-zinc-700/50 mb-1">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Action Menu</p>
                            </div>
                            <button
                              onClick={() => { handleEdit(quiz); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2 text-left text-xs text-zinc-300 hover:bg-[#FF7AB6]/10 hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit Title
                            </button>
                            <button
                              onClick={() => { handleDuplicate(quiz); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2 text-left text-xs text-zinc-300 hover:bg-[#FF7AB6]/10 hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" /> Duplicate
                            </button>
                            <button
                              onClick={() => { handleTogglePublish(quiz); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2 text-left text-xs text-zinc-300 hover:bg-[#FF7AB6]/10 hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> 
                              {quiz.status === 'Published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => { handleShare(quiz); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2 text-left text-xs text-zinc-300 hover:bg-[#FF7AB6]/10 hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5" /> Share Link
                            </button>
                            <div className="my-1 border-t border-zinc-700/50" />
                            <button
                              onClick={() => { handleDelete(quiz); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}