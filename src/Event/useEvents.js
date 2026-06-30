// useEvents.js — Fixed export
import { useState, useEffect, useCallback } from 'react';

const DEFAULT_EVENTS = [
  {
    id: 1,
    quizId: 1782575637937,
    title: 'this is quzz',
    description: 'fdgfdg',
    status: 'upcoming',
    questions: 15,
    participants: 0,
    date: '2026-07-05',
    time: '14:00',
    availability: 'Only visible to invited students',
    createdAt: 'Just now'
  },
  {
    id: 2,
    quizId: 1782575637938,
    title: 'this is a try',
    description: 'fdgfd',
    status: 'upcoming',
    questions: 15,
    participants: 0,
    date: '2026-07-10',
    time: '10:00',
    availability: 'Only visible to invited students',
    createdAt: 'Just now'
  }
];

export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('quizzyEvents');
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('quizzyEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = useCallback((eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      status: 'upcoming',
      participants: 0,
      createdAt: 'Just now'
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, ...updates } : evt));
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const duplicateEvent = useCallback((evt) => {
    const duplicated = {
      ...evt,
      id: Date.now(),
      title: `${evt.title} (Copy)`,
      participants: 0,
      status: 'upcoming',
      createdAt: 'Just now'
    };
    setEvents(prev => [duplicated, ...prev]);
    return duplicated;
  }, []);

  return { events, addEvent, updateEvent, deleteEvent, duplicateEvent };
}

// Also export as default for compatibility
export default useEvents;   