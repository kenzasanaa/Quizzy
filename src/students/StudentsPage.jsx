import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  ChevronRight, 
  MoreVertical,
  X,
  LogOut,
  Menu,
  Info,
  UserPlus,
  Mail,
  Trash2,
  Award
} from 'lucide-react';

export default function StudentsPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('students');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Track active popup menu dropdown ID for row actions
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Invite Student Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteClass, setInviteClass] = useState('10A');
  const [modalValidationError, setModalValidationError] = useState('');

  // Filter & Search states
  const [classFilter, setClassFilter] = useState('All Students'); // 'All Students', '10A', '10B'
  const [searchQuery, setSearchQuery] = useState('');

  // --- RETRIEVE USER ROLE FOR CONDITIONAL RENDERING ---
  const userRole = localStorage.getItem('userRole'); // 'teacher' or 'student'

  // Loaded lists from LocalStorage
  const [studentsList, setStudentsList] = useState(() => {
    const saved = localStorage.getItem('studentsList');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Alex Johnson', class: '10A', quizzesTaken: 12, avgScore: 85, lastActive: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
      { id: 2, name: 'Emma Watson', class: '10A', quizzesTaken: 14, avgScore: 92, lastActive: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
      { id: 3, name: 'Michael Clark', class: '10B', quizzesTaken: 10, avgScore: 78, lastActive: '1 day ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
      { id: 4, name: 'Sophia Green', class: '10B', quizzesTaken: 11, avgScore: 89, lastActive: '30 mins ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' },
      { id: 5, name: 'Lucia Wilde', class: '10A', quizzesTaken: 13, avgScore: 87, lastActive: '3 hours ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' }
    ];
  });

  // Global click listener to dismiss Action Menus automatically
  useEffect(() => {
    const closeDropdowns = () => setActiveDropdownId(null);
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  // Sync list changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('studentsList', JSON.stringify(studentsList));
  }, [studentsList]);

  // --- SUBMIT INVITE STUDENT FORM ---
  const handleInviteStudent = () => {
    setModalValidationError('');

    if (!inviteName.trim()) {
      setModalValidationError("Validation Error: Please enter the student's full name.");
      return;
    }
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      setModalValidationError("Validation Error: Please enter a valid email address.");
      return;
    }

    const newStudentObj = {
      id: Date.now(),
      name: inviteName,
      class: inviteClass,
      quizzesTaken: 0,
      avgScore: 0,
      lastActive: 'Never active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' // default placeholder avatar
    };

    setStudentsList([...studentsList, newStudentObj]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleActionDeleteStudent = (student) => {
    if (confirm(`Are you sure you want to remove ${student.name} from the directory?`)) {
      setStudentsList(studentsList.filter(s => s.id !== student.id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quizzyToken');
    localStorage.removeItem('userRole');
    navigate('/signin');
  };

  // Sidebar Menu List
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'quizzes', label: 'Quizzes', icon: BookOpen, path: '/quizzes' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
    { id: 'students', label: 'Students', icon: Users, path: '/students' },
  ];

  // Filter & Search logic
  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = 
      classFilter === 'All Students' ? true : 
      student.class === classFilter;

    return matchesSearch && matchesClass;
  });

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black tracking-wider bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">
            Quizzy
          </span>
          {isMobile && (
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#1B1026]/80 text-sm border border-zinc-800/80 rounded-xl py-2.5 pl-9 pr-4 text-zinc-300 placeholder-zinc-500 outline-none focus:border-[#FF7AB6]/40" 
          />
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.id === 'students';
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none ${
                  isActive 
                    ? 'bg-[#FF7AB6] text-[#1B1026] font-bold shadow-md shadow-[#FF7AB6]/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComponent size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-zinc-800/50 space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-4 mb-2">Manage</span>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors outline-none">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-colors outline-none mt-8"
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <SidebarContent />
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
        <SidebarContent isMobile />
      </aside>

      {/* CONTENT PANEL */}
      <div className="grow flex flex-col min-h-screen min-w-0">
        
        <header className="h-20 border-b border-[#FF7AB6]/10 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-zinc-300 hover:text-white p-2 border border-zinc-800 rounded-xl bg-[#251836]/40 cursor-pointer"
            >
              <Menu size={20} />
            </button>

            <div className="relative w-44 sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#251836]/40 text-sm border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-zinc-300 placeholder-zinc-500 outline-none focus:border-[#FF7AB6]/40" 
              />
            </div>
          </div>

          {/* Conditional Rendering: Hide Header Create Quiz button for Students */}
          {userRole === 'teacher' && (
            <button 
              onClick={() => navigate('/create-quiz')}
              className="border border-[#FF7AB6]/40 hover:border-[#FF7AB6] text-[#FF7AB6] font-semibold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all bg-[#FF7AB6]/5 outline-none whitespace-nowrap"
            >
              <Plus size={16} /> Create Quiz
            </button>
          )}
        </header>

        {/* PAGE BODY */}
        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Students</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Manage your students and track their progress</p>
            </div>
            
            {/* Conditional Rendering: Hide Invite Students button for Students */}
            {userRole === 'teacher' && (
              <button 
                onClick={() => {
                  setModalValidationError('');
                  setInviteName('');
                  setInviteEmail('');
                  setIsInviteModalOpen(true);
                }}
                className="bg-linear-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max"
              >
                <UserPlus size={16} /> Invite Students
              </button>
            )}
          </div>

          {/* Card Container matches student directory layout */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/40">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white">Student Directory</h3>
                <p className="text-zinc-400 text-xs">View and manage all your students</p>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..." 
                    className="bg-[#1B1026]/90 text-xs border border-zinc-800 focus:border-[#FF7AB6]/40 rounded-xl py-2 pl-8 pr-4 text-zinc-300 placeholder-zinc-500 outline-none w-44" 
                  />
                </div>
              </div>
            </div>

            {/* Sub Tabs class filtering state */}
            <div className="flex items-center gap-1.5 p-1 bg-[#1B1026]/60 border border-zinc-800/40 rounded-xl w-max">
              {['All Students', '10A', '10B'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setClassFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    (classFilter === tab) 
                      ? 'bg-[#1B1026] text-[#FF7AB6] shadow-sm font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Directory Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800/50 text-xs font-bold text-zinc-400">
                    <th className="pb-4 pt-2">Name</th>
                    <th className="pb-4 pt-2">Class</th>
                    <th className="pb-4 pt-2">Quizzes Taken</th>
                    <th className="pb-4 pt-2">Average Score</th>
                    <th className="pb-4 pt-2">Last Active</th>
                    {userRole === 'teacher' && <th className="pb-4 pt-2 text-right"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-zinc-500 text-xs font-semibold">
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isMenuOpen = activeDropdownId === student.id;

                      return (
                        <tr key={student.id} className="text-sm text-zinc-300 hover:bg-white/2 transition-colors group">
                          {/* Student Profile Info */}
                          <td className="py-4 flex items-center gap-3.5">
                            <img 
                              src={student.avatar} 
                              alt={student.name} 
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#FF7AB6]/20" 
                            />
                            <span className="font-bold text-white group-hover:text-[#FF7AB6] transition-colors">{student.name}</span>
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
                                className="p-2 hover:bg-zinc-800/40 text-zinc-500 hover:text-white rounded-xl transition-colors outline-none"
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
                                    onClick={() => handleActionDeleteStudent(student)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all"
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
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>

      {/* --- INVITE STUDENT MODAL WINDOW (Image popup) --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#221630] border border-[#FF7AB6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight leading-none text-center sm:text-left">Invite Student</h2>
              <p className="text-zinc-500 text-xs text-center sm:text-left">Send an invite link or register a new student</p>
            </div>

            {/* Modal Warning parameters */}
            {modalValidationError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs py-3 px-4 rounded-xl flex items-start gap-2 animate-pulse">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>{modalValidationError}</span>
              </div>
            )}

            <div className="space-y-5">
              
              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">Full Name</label>
                <input 
                  type="text"
                  value={inviteName}
                  onChange={(e) => {
                    setModalValidationError('');
                    setInviteName(e.target.value);
                  }}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none text-sm text-white"
                />
              </div>

              {/* Student Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                  <input 
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setModalValidationError('');
                      setInviteEmail(e.target.value);
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-4 outline-none text-sm text-white"
                  />
                </div>
              </div>

              {/* Class Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">Class</label>
                <div className="relative">
                  <select 
                    value={inviteClass}
                    onChange={(e) => setInviteClass(e.target.value)}
                    className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none text-sm text-white appearance-none cursor-pointer"
                  >
                    <option value="10A">10A</option>
                    <option value="10B">10B</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Modal actions panel */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all outline-none"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleInviteStudent}
                className="bg-[#FF7AB6] text-[#1B1026] font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#FF7AB6]/10 outline-none animate-bounce-short"
              >
                Invite
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}