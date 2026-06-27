import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Child components
import Sidebar from './Sidebar';
import Header from './Header';
import StatsGrid from './StatsGrid';
import RecentEvents from './RecentEvents';
import TopStudents from './TopStudents';
import RecentQuizzes from './RecentQuizzes';
import EditEventModal from './EditEventModal';

// Utilities
import { 
  parseToISODate, 
  parseTo24hTime, 
  formatDisplayTime 
} from './dateHelpers';

const topStudentsMock = [
  { rank: 1, name: 'Alex John', subject: 'Science', score: 950, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
  { rank: 2, name: 'Emma Watson', subject: 'Mathematics', score: 920, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
  { rank: 3, name: 'Michael Clark', subject: 'Physics', score: 980, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
  { rank: 4, name: 'Sophia Green', subject: 'English', score: 890, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' },
  { rank: 5, name: 'Lucia Wilde', subject: 'Science', score: 870, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Managing local event editing processes
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Edit fields
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // State populated through API
  const [teacherName, setTeacherName] = useState('Teacher');
  const [quizzesList, setQuizzesList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [stats, setStats] = useState([]);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('userRole'); // 'teacher' or 'student'

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

  const getQuizScheduleStatus = (title) => {
    const match = eventsList.find(e => e.title.toLowerCase().trim() === title.toLowerCase().trim());
    if (!match || !match.date || match.time === "Unscheduled") {
      return "Not scheduled";
    }
    return formatDisplayTime(match.time);
  };

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
        setEventsList(eventsList.map(e => (e.id === editingEvent.id ? data.event : e)));
        setIsEditModalOpen(false);
      } else {
        setValidationError(data.message || 'Failed to update event.');
      }
    } catch (err) {
      setValidationError('Server connection failed. Could not save changes.');
    }
  };

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

  const handleCreateQuizRedirect = () => {
    navigate('/create-quiz');
  };

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
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
          navigate={navigate} 
        />
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
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobile 
          onClose={() => setIsMobileSidebarOpen(false)} 
          onLogout={handleLogout} 
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

        <div className="grow p-4 sm:p-8 space-y-8 overflow-y-auto max-w-full">
          
          {apiError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-bold">
              {apiError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Dashboard</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Welcome back, {teacherName}! Here's what's happening with your quizzes
              </p>
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

          {/* Metric Dashboard Stats */}
          <StatsGrid stats={stats} />

          {/* Primary Split View (Events & Leaderboards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RecentEvents 
                eventsList={eventsList} 
                userRole={userRole} 
                onManageEvent={handleOpenEditModal} 
              />
            </div>

            <div className="lg:col-span-5">
              <TopStudents topStudents={topStudentsMock} />
            </div>
          </div>

          {/* Bottom Grid: Recent Quizzes */}
          <RecentQuizzes 
            quizzesList={quizzesList} 
            userRole={userRole} 
            onGetQuizScheduleStatus={getQuizScheduleStatus} 
            onCreateQuiz={handleCreateQuizRedirect} 
          />

        </div>
      </div>

      {/* Edit / Manage Modal Overlay */}
      <EditEventModal 
        isOpen={isEditModalOpen}
        editingEvent={editingEvent}
        validationError={validationError}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDate={editDate}
        setEditDate={setEditDate}
        editTime={editTime}
        setEditTime={setEditTime}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        onClose={() => setIsEditModalOpen(false)}
        onDelete={handleDeleteEvent}
        onSave={handleSaveEvent}
      />

    </div>
  );
}