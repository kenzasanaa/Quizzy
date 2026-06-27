import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

// Shared Layout Components
import Sidebar from '../DashBord/Sidebar';
import Header from '../DashBord/Header';

// Local Page Components
import StudentFilters from './StudentFilters';
import StudentRow from './StudentRow';
import InviteStudentModal from './InviteStudentModal';

export default function StudentsPage() {
  const navigate = useNavigate();
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
  const [classFilter, setClassFilter] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');

  const userRole = localStorage.getItem('userRole'); // 'teacher' or 'student'

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

  useEffect(() => {
    const closeDropdowns = () => setActiveDropdownId(null);
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  useEffect(() => {
    localStorage.setItem('studentsList', JSON.stringify(studentsList));
  }, [studentsList]);

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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
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

  const handleCreateQuizRedirect = () => {
    navigate('/create-quiz');
  };

  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = 
      classFilter === 'All Students' ? true : 
      student.class === classFilter;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="students" navigate={navigate} />
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
          activeTab="students" 
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
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Students</h1>
              <p className="text-zinc-400 text-xs sm:text-sm">Manage your students and track their progress</p>
            </div>
            
            {userRole === 'teacher' && (
              <button 
                onClick={() => {
                  setModalValidationError('');
                  setInviteName('');
                  setInviteEmail('');
                  setIsInviteModalOpen(true);
                }}
                className="bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-[#FF7AB6]/10 outline-none w-max cursor-pointer"
              >
                <UserPlus size={16} /> Invite Students
              </button>
            )}
          </div>

          {/* Table Container Card */}
          <div className="bg-[#251836]/80 border border-[#FF7AB6]/5 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <StudentFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              classFilter={classFilter}
              setClassFilter={setClassFilter}
            />

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
                    filteredStudents.map((student) => (
                      <StudentRow 
                        key={student.id}
                        student={student}
                        userRole={userRole}
                        activeDropdownId={activeDropdownId}
                        setActiveDropdownId={setActiveDropdownId}
                        onDelete={handleActionDeleteStudent}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>

      <InviteStudentModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteName={inviteName}
        setInviteName={setInviteName}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteClass={inviteClass}
        setInviteClass={setInviteClass}
        modalValidationError={modalValidationError}
        setModalValidationError={setModalValidationError}
        onInvite={handleInviteStudent}
      />

    </div>
  );
}