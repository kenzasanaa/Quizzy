import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import Sidebar from '../DashBord/Sidebar';
import Header from '../DashBord/Header';
import EventFilters from './EventFilters';
import EventCard from './EventCard';
import ScheduleModal from './ScheduleModal';
import EmptyState from './EmptyState';
import useEvents from './useEvents';

export default function EventsPage() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const userRole = localStorage.getItem('userRole') || 'teacher';

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [modalError, setModalError] = useState('');

  // Form state
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [availability, setAvailability] = useState('Only visible to invited students');

  // Data
  const { events, addEvent, updateEvent, deleteEvent, duplicateEvent } = useEvents();

  const [quizzesList] = useState(() => {
    try {
      const saved = localStorage.getItem('quizzesList');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Close dropdown on outside click
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

  // Modal handlers
  const openNewModal = () => {
    setEditingEventId(null);
    setSelectedQuizId('');
    setEventDate('');
    setEventTime('');
    setAvailability('Only visible to invited students');
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEventId(evt.id);
    setSelectedQuizId(String(evt.quizId));
    setEventDate(evt.date || '');
    setEventTime(evt.time || '');
    setAvailability(evt.availability || 'Only visible to invited students');
    setModalError('');
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  const handleSchedule = () => {
    if (!selectedQuizId) {
      setModalError('Please select a quiz');
      return;
    }
    if (!eventDate) {
      setModalError('Please select a date');
      return;
    }
    if (!eventTime) {
      setModalError('Please select a time');
      return;
    }

    const quiz = quizzesList.find(q => String(q.id) === String(selectedQuizId));
    const eventData = {
      quizId: selectedQuizId,
      title: quiz?.title || 'Untitled Quiz',
      description: quiz?.description || 'No description',
      questions: quiz?.questions || 0,
      date: eventDate,
      time: eventTime,
      availability
    };

    if (editingEventId) {
      updateEvent(editingEventId, eventData);
    } else {
      addEvent(eventData);
    }

    setIsModalOpen(false);
  };

  // Card actions
  const handleManage = (evt) => openEditModal(evt);

  const handleDropdownToggle = (id) => {
    setActiveDropdownId(prev => prev === id ? null : id);
  };

  const handleEdit = (evt) => openEditModal(evt);

  const handleDuplicate = (evt) => {
    duplicateEvent(evt);
    setActiveDropdownId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
    setActiveDropdownId(null);
  };

  // Filter events
  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || evt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="events" navigate={navigate} />
      </aside>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} navigate={navigate} />

      {/* Main Content */}
      <div className="grow flex flex-col min-h-screen min-w-0">
        <Header 
          userRole={userRole} 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
          onCreateQuiz={() => navigate('/create-quiz')} 
        />

        <div className="grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-full">
          
          {/* Page Header */}
          <PageHeader userRole={userRole} onSchedule={openNewModal} />

          {/* Filters */}
          <EventFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Events List */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <EmptyState onSchedule={openNewModal} />
            ) : (
              filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  evt={evt}
                  onManage={handleManage}
                  onDropdownClick={handleDropdownToggle}
                  isDropdownOpen={activeDropdownId === evt.id}
                  dropdownRef={dropdownRef}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

        </div>
      </div>

      {/* Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={!!editingEventId}
        quizzesList={quizzesList}
        selectedQuizId={selectedQuizId}
        onQuizChange={(v) => { setSelectedQuizId(v); setModalError(''); }}
        eventDate={eventDate}
        onDateChange={(v) => { setEventDate(v); setModalError(''); }}
        eventTime={eventTime}
        onTimeChange={(v) => { setEventTime(v); setModalError(''); }}
        availability={availability}
        onAvailabilityChange={setAvailability}
        error={modalError}
        onSchedule={handleSchedule}
      />

    </div>
  );
}

/* Sub-components */

function PageHeader({ userRole, onSchedule }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">Quiz Events</h1>
        <p className="text-zinc-400 text-xs sm:text-sm">Schedule and manage quiz sessions for your students</p>
      </div>
      
      {userRole === 'teacher' && (
        <button 
          onClick={onSchedule}
          className="bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max cursor-pointer"
        >
          <Plus size={16} /> Schedule Event
        </button>
      )}
    </div>
  );
}

function MobileDrawer({ isOpen, onClose, navigate }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 p-6 z-50 transform translate-x-0 transition-transform duration-300 lg:hidden">
        <Sidebar activeTab="events" isMobile onClose={onClose} navigate={navigate} />
      </aside>
    </>
  );
}