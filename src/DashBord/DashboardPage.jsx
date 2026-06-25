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
  BarChart2, 
  Award,
  LogOut,
  Menu,
  X,
  Info,
  Clock 
} from 'lucide-react';

// --- HELPER CONVERTERS FOR DATE/TIME PICKERS ---
const parseToISODate = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split('T')[0];
};

const parseTo24hTime = (timeStr) => {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (match) {
    let [_, hours, minutes, am_pm] = match;
    hours = parseInt(hours);
    if (am_pm.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (am_pm.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  const d = new Date(`1970-01-01 ${timeStr}`);
  if (!isNaN(d.getTime())) {
    return d.toTimeString().split(' ')[0].slice(0, 5);
  }
  return "";
};

const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(', ');
  if (parts.length === 2 && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) {
    const [date, time] = parts;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const parsedDate = new Date(date + "T00:00:00");
    if (!isNaN(parsedDate.getTime())) {
      return `${parsedDate.toLocaleDateString('en-US', options)}, ${time}`;
    }
  }
  return timeStr;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Редактирование ивентов
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Поля редактирования формы
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // --- BACKEND API CONNECTED STATES ---
  const [teacherName, setTeacherName] = useState('Teacher');
  const [quizzesList, setQuizzesList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [stats, setStats] = useState([]);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  // --- RETRIEVE USER ROLE FOR CONDITIONAL RENDERING ---
  const userRole = localStorage.getItem('userRole'); // 'teacher' or 'student'

  // --- FETCH DATA FROM THE SERVER ON MOUNT ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('quizzyToken');

      try {
        const response = await fetch('http://localhost:5000/api/teacher/dashboard-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setTeacherName(data.teacherName);
          setQuizzesList(data.quizzesList);
          setEventsList(data.eventsList);
          setStats(data.stats);
        } else {
          setApiError(data.message || 'Unauthorized session');
          // If token has expired, kick them back to login page
          localStorage.clear();
          navigate('/signin');
        }
      } catch (err) {
        setApiError('Unable to fetch dashboard data. Server is offline.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Проверка статуса планирования для карточки квиза
  const getQuizScheduleStatus = (title) => {
    const match = eventsList.find(e => e.title.toLowerCase().trim() === title.toLowerCase().trim());
    if (!match || !match.date || match.time === "Unscheduled") {
      return "Not scheduled";
    }
    return formatDisplayTime(match.time);
  };

  // Валидатор дат и наложения расписания
  const isScheduleValid = (dateStr, timeStr, eventId) => {
    const hasConflict = eventsList.some(
      e => e.id !== eventId && 
      e.date.toLowerCase().trim() === dateStr.toLowerCase().trim() && 
      e.clockTime.toLowerCase().trim() === timeStr.toLowerCase().trim()
    );
    if (hasConflict) {
      return { valid: false, reason: "Schedule conflict: This slot is already booked for another event." };
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { valid: false, reason: "Invalid date selected." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    if (d < today) {
      return { valid: false, reason: "The scheduled date cannot be in the past." };
    }

    return { valid: true };
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setEditTitle(evt.title);
    setEditDate(parseToISODate(evt.date));
    setEditTime(parseTo24hTime(evt.clockTime));
    setEditDesc(evt.description);
    setValidationError('');
    setIsEditModalOpen(true);
  };

  // --- API PUT: UPDATE EVENT ON THE SERVER ---
  const handleSaveEvent = async () => {
    if (!editDate) {
      setValidationError("Please select a date.");
      return;
    }
    if (!editTime) {
      setValidationError("Please select a time.");
      return;
    }

    const check = isScheduleValid(editDate, editTime, editingEvent.id);
    if (!check.valid) {
      setValidationError(check.reason);
      return;
    }

    setValidationError('');

    const updatedData = {
      title: editTitle,
      date: editDate,
      clockTime: editTime,
      description: editDesc,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        // Sync our local react state with the server's response
        setEventsList(eventsList.map(e => (e.id === editingEvent.id ? data.event : e)));
        setIsEditModalOpen(false);
      } else {
        setValidationError(data.message || 'Failed to update event.');
      }
    } catch (err) {
      setValidationError('Server connection failed. Could not save changes.');
    }
  };

  // --- API DELETE: DELETE EVENT ON THE SERVER ---
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEventsList(eventsList.filter(e => e.id !== editingEvent.id));
        setIsEditModalOpen(false);
      } else {
        setValidationError('Failed to delete event from the server.');
      }
    } catch (err) {
      setValidationError('Server connection failed. Could not delete event.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quizzyToken');
    localStorage.removeItem('userRole');
    navigate('/signin');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'quizzes', label: 'Quizzes', icon: BookOpen, path: '/quizzes' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
    { id: 'students', label: 'Students', icon: Users, path: '/students' },
  ];

  const topStudents = [
    { rank: 1, name: 'Alex John', subject: 'Science', score: 950, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    { rank: 2, name: 'Emma Watson', subject: 'Mathematics', score: 920, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    { rank: 3, name: 'Michael Clark', subject: 'Physics', score: 980, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    { rank: 4, name: 'Sophia Green', subject: 'English', score: 890, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' },
    { rank: 5, name: 'Lucia Wilde', subject: 'Science', score: 870, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
  ];

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
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  } else {
                    setActiveTab(item.id);
                  }
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

  // Loader view while loading from the API
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1026] flex items-center justify-center text-zinc-300">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-t-[#FF7AB6] border-zinc-800 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold">Loading your Quizzy dashboard...</p>
        </div>
      </div>
    );
  }

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

        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          {/* Error Warning */}
          {apiError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-bold">
              {apiError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Dashboard</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Welcome back, {teacherName}! Here's what's happening with your quizzes</p>
            </div>
            
            {/* Conditional Rendering: Hide Header Create New Quiz button for Students */}
            {userRole === 'teacher' && (
              <button 
                onClick={() => navigate('/create-quiz')}
                className="bg-linear-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max"
              >
                <Plus size={16} /> Create New Quiz
              </button>
            )}
          </div>

          {/* Dynamic Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon === Calendar ? Calendar : stat.icon === Users ? Users : stat.icon === BarChart2 ? BarChart2 : BookOpen;
              return (
                <div key={idx} className="bg-[#251836]/80 border border-[#FF7AB6]/5 p-5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-zinc-400 block">{stat.label}</span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl font-black text-white">{stat.value}</span>
                      <span className={`text-xs font-bold ${stat.isNegative ? 'text-rose-400' : 'text-[#FFB86B]'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1B1026]/50 border border-[#FF7AB6]/10" style={{ color: stat.color }}>
                    <IconComp size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recent Events Section */}
            <div className="lg:col-span-7 bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">Recent Events</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Manage your upcoming and active quiz events</p>
              </div>

              <div className="space-y-3">
                {eventsList.slice(-3).reverse().map((evt) => (
                  <div key={evt.id} className="bg-[#1B1026]/60 border border-zinc-800/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border shrink-0 ${evt.isLive ? 'bg-[#FF7AB6]/15 text-[#FF7AB6] border-[#FF7AB6]/20' : 'bg-[#FFB86B]/15 text-[#FFB86B] border-[#FFB86B]/20'}`}>
                        <Calendar size={18} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white leading-tight">{evt.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                          <span>{formatDisplayTime(evt.time)}</span>
                          <span className="text-zinc-600 hidden sm:inline">•</span>
                          <span>{evt.participants}</span>
                        </div>
                      </div>
                    </div>

                    {/* Conditional Rendering: Hide Manage button on events for Students */}
                    {userRole === 'teacher' && (
                      <button 
                        onClick={() => handleOpenEditModal(evt)}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all outline-none border border-[#FF7AB6]/40 hover:border-[#FF7AB6] text-[#FF7AB6]`}
                      >
                        Manage
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students */}
            <div className="lg:col-span-5 bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">Top Students</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Students with highest quiz scores</p>
              </div>

              <div className="space-y-4">
                {topStudents.map((std, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-sm font-bold text-zinc-500 w-4 shrink-0">{std.rank}</span>
                      <img src={std.avatar} alt={std.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#FF7AB6]/20 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white leading-tight truncate">{std.name}</h4>
                        <span className="text-xs text-zinc-400 block truncate">{std.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-black text-[#FFB86B] shrink-0">
                      <Award size={16} />
                      <span>{std.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quizzes List */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-5 sm:p-6 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">Recent Quizzes</h3>
              <p className="text-zinc-400 text-xs mt-0.5">Your recently created quizzes</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quizzesList.slice(-3).reverse().map((quiz, idx) => {
                const scheduleStatus = getQuizScheduleStatus(quiz.title);
                const isUnscheduled = scheduleStatus === "Not scheduled";

                return (
                  <div key={quiz.id || idx} className="bg-[#1B1026]/80 border border-zinc-800/60 p-8 rounded-2xl flex flex-col justify-between h-52 hover:border-[#FF7AB6]/30 transition-all group">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-white leading-snug group-hover:text-[#FF7AB6] transition-colors">{quiz.title}</h4>
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
                            className="h-full bg-linear-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] rounded-full" 
                            style={{ width: `${quiz.rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Conditional Rendering: Hide Create New Quiz Card for Students */}
              {userRole === 'teacher' && (
                <button 
                  onClick={() => navigate('/create-quiz')}
                  className="border-2 border-dashed border-zinc-800 hover:border-[#FF7AB6]/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-52 gap-3 group transition-all outline-none w-full"
                >
                  <div className="p-2.5 rounded-xl bg-[#1B1026] border border-zinc-800 text-zinc-500 group-hover:text-[#FF7AB6] group-hover:border-[#FF7AB6]/30 transition-all">
                    <Plus size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-300 group-hover:text-white transition-colors">Create New Quiz</h4>
                    <p className="text-[10px] text-zinc-500 leading-snug max-w-37.5 mx-auto mt-0.5">Add questions, set time limits and more</p>
                  </div>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- EDIT / MANAGE EVENT QUIZ POPUP --- */}
      {isEditModalOpen && editingEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#221630] border border-[#FF7AB6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none"
            >
              <X size={16} />
            </button>

            <h2 className="text-2xl font-black text-white leading-none">Edit Quiz</h2>

            {validationError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs py-3 px-4 rounded-xl flex items-start gap-2 animate-pulse">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400">Quiz Title</label>
                <input 
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input 
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Time</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input 
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400">Description</label>
                <textarea 
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#1B1026] border border-zinc-800 focus:border-[#FF7AB6] rounded-xl py-3 px-4 outline-none transition-all text-sm text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button 
                  type="button"
                  onClick={handleDeleteEvent}
                  className="border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:bg-rose-500/5 px-6 py-3 rounded-xl text-sm font-bold transition-all outline-none"
                >
                  Delete Quiz
                </button>
                <button 
                  type="button"
                  onClick={handleSaveEvent}
                  className="bg-linear-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-md shadow-[#FF7AB6]/10 outline-none"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}