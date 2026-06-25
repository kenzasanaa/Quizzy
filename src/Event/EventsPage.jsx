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
  Clock,
  MoreVertical,
  X,
  LogOut,
  Menu,
  Info,
  Edit3,
  Copy,
  Trash2
} from 'lucide-react';

// --- RELATIVE TIME HELPERS TO DEMONSTRATE ALL DYNAMIC STATUSES DYNAMICALLY ---
const getRelativeDateString = (offsetMinutes) => {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getRelativeTimeString = (offsetMinutes) => {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

// Formatting helper for user-friendly UI display
const formatDisplayDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const parsedDate = new Date(`${dateStr}T${timeStr}`);
  if (!isNaN(parsedDate.getTime())) {
    return `${parsedDate.toLocaleDateString('en-US', options)}, ${timeStr}`;
  }
  return `${dateStr}, ${timeStr}`;
};

export default function EventsPage() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter & Search states
  const [eventFilter, setEventFilter] = useState('All Events'); // 'All Events', 'Active', 'Upcoming', 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizFilter, setSelectedQuizFilter] = useState('All Quizzes');

  // Track active popup menu dropdown ID
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Schedule Event Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleEventQuizId, setScheduleEventQuizId] = useState('');
  const [scheduleEventDate, setScheduleEventDate] = useState('');
  const [scheduleEventTime, setScheduleEventTime] = useState('');
  const [scheduleEventAvailability, setScheduleEventAvailability] = useState('Only visible to invited students');
  const [modalValidationError, setModalValidationError] = useState('');

  // --- RETRIEVE USER ROLE FOR CONDITIONAL RENDERING ---
  const userRole = localStorage.getItem('userRole'); // 'teacher' or 'student'

  // Loaded lists from LocalStorage
  const [quizzesList] = useState(() => {
    const saved = localStorage.getItem('quizzesList');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'Science Mid-term Quiz', questions: 15, duration: '20 min' },
      { id: 2, title: 'Mathematics Weekly Test', questions: 15, duration: '20 min' },
      { id: 3, title: 'Chemistry Quiz #3', questions: 15, duration: '20 min' },
    ];
  });

  const [eventsList, setEventsList] = useState(() => {
    const saved = localStorage.getItem('eventsList');
    if (saved) return JSON.parse(saved);
    
    // Default system events configured relative to current time so statuses show perfectly
    return [
      { 
        id: 1, 
        title: 'Science Mid-term Quiz', 
        date: getRelativeDateString(-10), // Started 10 minutes ago (Active)
        clockTime: getRelativeTimeString(-10),
        participants: '32 participants',
        description: 'Basic concepts of biology for beginners',
        iconType: 'book' // Lavender book icon wrapper type
      },
      { 
        id: 2, 
        title: 'Mathematics Weekly Test', 
        date: getRelativeDateString(120), // Starts in 2 hours (Upcoming)
        clockTime: getRelativeTimeString(120),
        participants: '28 participants',
        description: 'Basic concepts of biology for beginners',
        iconType: 'calendar' // Sunset gold calendar icon wrapper type
      },
      { 
        id: 3, 
        title: 'Chemistry Quiz #3', 
        date: getRelativeDateString(-180), // Started 3 hours ago (Completed)
        clockTime: getRelativeTimeString(-180),
        participants: '45 participants',
        description: 'Basic concepts of biology for beginners',
        iconType: 'calendar'
      },
    ];
  });

  // Global click listener to dismiss Action Menus automatically
  useEffect(() => {
    const closeDropdowns = () => setActiveDropdownId(null);
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  useEffect(() => {
    localStorage.setItem('eventsList', JSON.stringify(eventsList));
  }, [eventsList]);

  // --- DYNAMIC STATUS COMPARISON SYSTEM ---
  const getEventStatus = (evt) => {
    if (!evt.date || !evt.clockTime) return 'Upcoming';
    
    const [year, month, day] = evt.date.split('-').map(Number);
    const [hours, minutes] = evt.clockTime.split(':').map(Number);
    const eventStart = new Date(year, month - 1, day, hours, minutes);
    
    const now = new Date();
    const sessionDurationMs = 60 * 60 * 1000; 
    const eventEnd = new Date(eventStart.getTime() + sessionDurationMs);

    if (now < eventStart) {
      return 'Upcoming';
    } else if (now >= eventStart && now <= eventEnd) {
      return 'Active';
    } else {
      return 'Completed';
    }
  };

  // --- SUBMIT SCHEDULE EVENT FORM WITH VALIDATION ---
  const handleScheduleEvent = () => {
    setModalValidationError('');

    if (!scheduleEventQuizId) {
      setModalValidationError("Validation Error: Please select a quiz from the list.");
      return;
    }
    if (!scheduleEventDate) {
      setModalValidationError("Validation Error: Please select a valid date.");
      return;
    }
    if (!scheduleEventTime) {
      setModalValidationError("Validation Error: Please select a valid time.");
      return;
    }

    const [year, month, day] = scheduleEventDate.split('-').map(Number);
    const [hours, minutes] = scheduleEventTime.split(':').map(Number);
    const selectedDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();

    if (selectedDateTime < now) {
      setModalValidationError("Validation Error: The selected event date/time cannot be in the past.");
      return;
    }

    const targetQuiz = quizzesList.find(q => q.id === parseInt(scheduleEventQuizId));
    const newEventObj = {
      id: Date.now(),
      title: targetQuiz ? targetQuiz.title : "New Quiz Session",
      date: scheduleEventDate,
      clockTime: scheduleEventTime,
      participants: '0 participants',
      description: 'Basic concepts of biology for beginners',
      iconType: Math.random() > 0.5 ? 'book' : 'calendar'
    };

    setEventsList([newEventObj, ...eventsList]);
    setIsScheduleModalOpen(false);
  };

  // Action Menu operational triggers
  const handleActionEdit = (evt) => {
    const newTitle = prompt("Edit Event Title:", evt.title);
    if (newTitle && newTitle.trim()) {
      setEventsList(eventsList.map(e => e.id === evt.id ? { ...e, title: newTitle } : e));
    }
  };

  const handleActionDuplicate = (evt) => {
    const duplicated = {
      ...evt,
      id: Date.now(),
      title: `${evt.title} (Copy)`,
      participants: '0 participants'
    };
    setEventsList([duplicated, ...eventsList]);
  };

  const handleActionDelete = (evt) => {
    if (confirm(`Are you sure you want to delete "${evt.title}"?`)) {
      setEventsList(eventsList.filter(e => e.id !== evt.id));
    }
  };

  // Sidebar Menu List
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'quizzes', label: 'Quizzes', icon: BookOpen, path: '/quizzes' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
    { id: 'students', label: 'Students', icon: Users, path: '/students' },
  ];

  // Dynamic filter lists
  const filteredEvents = eventsList.filter(evt => {
    const status = getEventStatus(evt);
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      eventFilter === 'All Events' ? true :
      eventFilter === 'Active' ? status === 'Active' :
      eventFilter === 'Upcoming' ? status === 'Upcoming' :
      eventFilter === 'Completed' ? status === 'Completed' : true;

    const matchesQuiz = 
      selectedQuizFilter === 'All Quizzes' ? true : 
      evt.title.toLowerCase().trim() === selectedQuizFilter.toLowerCase().trim();

    return matchesSearch && matchesTab && matchesQuiz;
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
            className="w-full bg-[#170E2A]/80 text-sm border border-zinc-800/80 rounded-xl py-2.5 pl-9 pr-4 text-zinc-300 placeholder-zinc-500 outline-none focus:border-[#FF7AB6]/40" 
          />
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.id === 'events';
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none ${
                  isActive 
                    ? 'bg-[#FF7AB6] text-[#170E2A] font-bold shadow-lg shadow-[#9396C2]/20' 
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
        onClick={() => navigate('/')}
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
              className="border border-[#FF7AB6]/30 hover:border-[#FF7AB6] text-[#FF7AB6] font-semibold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all bg-[#FF7AB6]/5 outline-none whitespace-nowrap"
            >
              <Plus size={16} /> Create Quiz
            </button>
          )}
        </header>

        {/* PAGE BODY */}
        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Quiz Events</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Schedule and manage quiz sessions for your students</p>
            </div>
            
            {/* Conditional Rendering: Hide Schedule Event button for Students */}
            {userRole === 'teacher' && (
              <button 
                onClick={() => {
                  setModalValidationError('');
                  setScheduleEventQuizId('');
                  setIsScheduleModalOpen(true);
                }}
                className="bg-linear-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max"
              >
                <Calendar size={16} /> Schedule Event
              </button>
            )}
          </div>

          {/* Card Container matches screenshot 2 */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/40">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-white">Event Calendar</h3>
                <p className="text-zinc-400 text-xs">View and manage your scheduled quiz events</p>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..." 
                    className="bg-[#170E2A]/90 text-xs border border-zinc-800 focus:border-[#FBB9A6]/40 rounded-xl py-2 pl-8 pr-4 text-zinc-300 placeholder-zinc-500 outline-none w-44" 
                  />
                </div>

                <select 
                  value={selectedQuizFilter}
                  onChange={(e) => setSelectedQuizFilter(e.target.value)}
                  className="bg-[#170E2A]/90 border border-zinc-800/40 text-xs border  focus:border-[#FBB9A6]/40 rounded-xl py-2 px-3 text-zinc-300 outline-none"
                >
                  <option value="All Quizzes">All Quizzes</option>
                  {quizzesList.map(q => (
                    <option key={q.id} value={q.title}>{q.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub Tabs filtering state */}
            <div className="flex items-center gap-1.5 p-1 bg-[#170E2A]/60 border border-zinc-800/40 rounded-xl w-max">
              {['All Events', 'Active', 'Upcoming', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEventFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    (eventFilter === tab) 
                      ? 'bg-[#170E2A] text-[#FF7AB6] shadow-sm font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List rendered dynamic sessions */}
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-semibold">
                  No scheduled quiz sessions found matching the filter.
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  const status = getEventStatus(evt);
                  const isMenuOpen = activeDropdownId === evt.id;

                  return (
                    <div 
                      key={evt.id}
                      className="p-4 rounded-2xl border bg-[#1B1026]/60 border border-zinc-800/40 hover:border-zinc-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Dynamic Wrapper Styling matches Image 4 & 5 */}
                        {evt.iconType === 'book' ? (
                          <div className="p-3.5 rounded-xl border shrink-0 bg-[#170E2A] text-[#9396C2] border-[#9396C2]/10">
                            <BookOpen size={18} />
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl border shrink-0 bg-[#FFB86B]/15 text-[#FFB86B] border-[#FFB86B]/20">
                            <Calendar size={18} />
                          </div>
                        )}

                        {/* Event Title, details & computed badges */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-sm text-white truncate">{evt.title}</h4>
                            
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                                : status === 'Upcoming' 
                                ? 'bg-indigo-500/10 text-[#9396C2] border border-[#9396C2]/20' 
                                : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                            }`}>
                              {status}
                            </span>
                          </div>

                          <p className="text-zinc-400 text-xs truncate max-w-sm sm:max-w-md">
                            {evt.description || "Basic concepts of biology for beginners"}
                          </p>

                          {/* Render Dynamic Stats parameters */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 font-medium">
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} /> 15 questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {formatDisplayDateTime(evt.date, evt.clockTime)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} /> {evt.participants || "32 completions"}
                            </span>
                            <span className="text-[10px] text-zinc-600">Created just now</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center relative">
                        {status === 'Active' ? (
                          <button 
                            className="px-4 py-2 bg-[#9396C2] hover:bg-[#8C88BA] text-[#170E2A] rounded-xl text-xs font-bold transition-all outline-none"
                          >
                            View Live
                          </button>
                        ) : (
                          /* Conditional Rendering: Hide Manage button for Students */
                          userRole === 'teacher' && (
                            <button 
                              className="px-4 py-2 border border-[#FF7AB6]/40 hover:border-[#FF7AB6] text-[#FF7AB6] rounded-xl text-xs font-bold transition-all outline-none"
                            >
                              Manage
                            </button>
                          )
                        )}

                        {/* Conditional Rendering: Hide Actions (Edit/Delete Menu toggler) for Students */}
                        {userRole === 'teacher' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(isMenuOpen ? null : evt.id);
                            }}
                            className="p-2 hover:bg-zinc-800/40 text-zinc-500 hover:text-white rounded-xl transition-colors outline-none"
                          >
                            <MoreVertical size={16} />
                          </button>
                        )}

                        {/* Screenshot 3: Absolute Dropdown Action Menu */}
                        {userRole === 'teacher' && isMenuOpen && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-11 bg-[#110726] border border-zinc-800 rounded-2xl p-2 w-44 shadow-2xl z-40 animate-in fade-in slide-in-from-top-1 duration-150"
                          >
                            <span className="text-[9px] font-black text-zinc-500 tracking-wider uppercase block px-3 py-1 mb-1">
                              Action Menu
                            </span>

                            <button 
                              onClick={() => {
                                handleActionEdit(evt);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <Edit3 size={14} className="text-zinc-400" />
                              Edit
                            </button>

                            <button 
                              onClick={() => {
                                handleActionDuplicate(evt);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                              <Copy size={14} className="text-zinc-400" />
                              Duplicate
                            </button>

                            <div className="border-t border-zinc-800/50 my-1" />

                            <button 
                              onClick={() => {
                                handleActionDelete(evt);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition-all"
                            >
                              <Trash2 size={14} className="text-rose-400" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>
      </div>

      {/* --- SCHEDULE EVENT WINDOW POPUP (Image 1 popup) --- */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#221630] border border-[#FBB9A6]/15 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 bg-zinc-950/40 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all outline-none"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight leading-none text-center sm:text-left">Schedule Event</h2>
              <p className="text-zinc-500 text-xs text-center sm:text-left">Create and schedule a new quiz event</p>
            </div>

            {/* Modal Warning parameters */}
            {modalValidationError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs py-3 px-4 rounded-xl flex items-start gap-2 animate-pulse">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>{modalValidationError}</span>
              </div>
            )}

            <div className="space-y-5">
              
              {/* Quiz Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">Quiz</label>
                <div className="relative">
                  <select 
                    value={scheduleEventQuizId}
                    onChange={(e) => {
                      setModalValidationError('');
                      setScheduleEventQuizId(e.target.value);
                    }}
                    className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 px-4 outline-none text-sm text-white appearance-none cursor-pointer"
                  >
                    <option value="">Select a quiz</option>
                    {quizzesList.map(q => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* When? date and time fields */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">When?</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input 
                      type="date"
                      value={scheduleEventDate}
                      onChange={(e) => {
                        setModalValidationError('');
                        setScheduleEventDate(e.target.value);
                      }}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 pl-10 pr-4 outline-none text-sm text-white"
                    />
                  </div>

                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input 
                      type="time"
                      value={scheduleEventTime}
                      onChange={(e) => {
                        setModalValidationError('');
                        setScheduleEventTime(e.target.value);
                      }}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 pl-10 pr-4 outline-none text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Availability block */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 block">Availability</label>
                <div className="relative">
                  <select 
                    value={scheduleEventAvailability}
                    onChange={(e) => setScheduleEventAvailability(e.target.value)}
                    className="w-full bg-[#170E2A] border border-zinc-800 focus:border-[#FBB9A6] rounded-xl py-3 px-4 outline-none text-sm text-white appearance-none cursor-pointer"
                  >
                    <option value="Only visible to invited students">Only visible to invited students</option>
                    <option value="Public to everyone">Public to everyone</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Modal actions panel */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all outline-none"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleScheduleEvent}
                className="bg-[#9396C2] hover:bg-[#8C88BA] text-[#170E2A] font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#9396C2]/20 outline-none"
              >
                Schedule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}