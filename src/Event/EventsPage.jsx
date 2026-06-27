import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

// Isolated Components
import Sidebar from '../DashBord/Sidebar';
import Header from '../DashBord/Header';
import EventFilters from './EventFilters';
import EventCard from './EventCard';
import ScheduleEventModal from './ScheduleEventModal';

// Dynamic Utility helpers
import { 
  getRelativeDateString, 
  getRelativeTimeString, 
  getEventStatus 
} from './eventHelpers';

export default function EventsPage() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter & Search values
  const [eventFilter, setEventFilter] = useState('All Events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizFilter, setSelectedQuizFilter] = useState('All Quizzes');

  // Popup Action dropdown toggles
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Modal Fields
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleEventQuizId, setScheduleEventQuizId] = useState('');
  const [scheduleEventDate, setScheduleEventDate] = useState('');
  const [scheduleEventTime, setScheduleEventTime] = useState('');
  const [scheduleEventAvailability, setScheduleEventAvailability] = useState('Only visible to invited students');
  const [modalValidationError, setModalValidationError] = useState('');

  const userRole = localStorage.getItem('userRole'); // 'teacher' or 'student'

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
    
    return [
      { 
        id: 1, 
        title: 'Science Mid-term Quiz', 
        date: getRelativeDateString(-10),
        clockTime: getRelativeTimeString(-10),
        participants: '32 participants',
        description: 'Basic concepts of biology for beginners',
        iconType: 'book'
      },
      { 
        id: 2, 
        title: 'Mathematics Weekly Test', 
        date: getRelativeDateString(120),
        clockTime: getRelativeTimeString(120),
        participants: '28 participants',
        description: 'Basic concepts of biology for beginners',
        iconType: 'calendar'
      },
      { 
        id: 3, 
        title: 'Chemistry Quiz #3', 
        date: getRelativeDateString(-180),
        clockTime: getRelativeTimeString(-180),
        participants: '45 participants',
        description: 'Basic concepts of biology for beginners',
        iconType: 'calendar'
      },
    ];
  });

  useEffect(() => {
    const closeDropdowns = () => setActiveDropdownId(null);
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  useEffect(() => {
    localStorage.setItem('eventsList', JSON.stringify(eventsList));
  }, [eventsList]);

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

  const handleCreateQuizRedirect = () => {
    navigate('/create-quiz');
  };

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

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="events" navigate={navigate} />
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
          activeTab="events" 
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
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Quiz Events</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Schedule and manage quiz sessions for your students</p>
            </div>
            
            {userRole === 'teacher' && (
              <button 
                onClick={() => {
                  setModalValidationError('');
                  setScheduleEventQuizId('');
                  setIsScheduleModalOpen(true);
                }}
                className="bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max cursor-pointer"
              >
                <Calendar size={16} /> Schedule Event
              </button>
            )}
          </div>

          {/* Cards Frame container */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <EventFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedQuizFilter={selectedQuizFilter}
              setSelectedQuizFilter={setSelectedQuizFilter}
              quizzesList={quizzesList}
              eventFilter={eventFilter}
              setEventFilter={setEventFilter}
            />

            {/* List rendered dynamic sessions */}
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-semibold">
                  No scheduled quiz sessions found matching the filter.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <EventCard 
                    key={evt.id}
                    evt={evt}
                    userRole={userRole}
                    activeDropdownId={activeDropdownId}
                    setActiveDropdownId={setActiveDropdownId}
                    onEdit={handleActionEdit}
                    onDuplicate={handleActionDuplicate}
                    onDelete={handleActionDelete}
                  />
                ))
              )}
            </div>

          </div>

        </div>
      </div>

      {/* SCHEDULE EVENT MODAL */}
      <ScheduleEventModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        quizzesList={quizzesList}
        scheduleEventQuizId={scheduleEventQuizId}
        setScheduleEventQuizId={setScheduleEventQuizId}
        scheduleEventDate={scheduleEventDate}
        setScheduleEventDate={setScheduleEventDate}
        scheduleEventTime={scheduleEventTime}
        setScheduleEventTime={setScheduleEventTime}
        scheduleEventAvailability={scheduleEventAvailability}
        setScheduleEventAvailability={setScheduleEventAvailability}
        modalValidationError={modalValidationError}
        setModalValidationError={setModalValidationError}
        onSchedule={handleScheduleEvent}
      />

    </div>
  );
}