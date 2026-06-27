import React from 'react';
import { Search, LayoutDashboard, BookOpen, Calendar, Users, Settings, LogOut, X } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'quizzes', label: 'Quizzes', icon: BookOpen, path: '/quizzes' },
  { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
  { id: 'students', label: 'Students', icon: Users, path: '/students' },
];

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isMobile = false, 
  onClose, 
  onLogout, 
  navigate 
}) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-[#FF7AB6] via-[#FFB86B] to-[#FFD166] bg-clip-text text-transparent">
            Quizzy
          </span>
          {isMobile && (
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 cursor-pointer"
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
                  if (isMobile && onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none cursor-pointer ${
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors outline-none cursor-pointer">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-colors outline-none mt-8 cursor-pointer"
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );
}