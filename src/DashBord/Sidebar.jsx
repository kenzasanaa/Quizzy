import React from 'react';
import { Search, LayoutDashboard, BookOpen, Calendar, Users, Settings, LogOut, X } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'quizzes', label: 'Quizzes', icon: BookOpen, path: '/quizzes' },
  { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
  { id: 'students', label: 'Students', icon: Users, path: '/students' },
];

const manageItems = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ activeTab, isMobile = false, onClose, onLogout, navigate }) {
  const handleNav = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const NavItem = ({ item }) => {
    const IconComponent = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        onClick={() => handleNav(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
          isActive
            ? 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] font-bold shadow-lg shadow-[#FF7AB6]/20'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#1B1026]' : 'text-zinc-400 group-hover:text-white'}`} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <span className="text-xl font-black bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] bg-clip-text text-transparent">
          Quizzy
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl text-xs text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40"
        />
      </div>

      {/* Main Nav */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Manage Section */}
      <div className="mt-auto pt-6 border-t border-[#FF7AB6]/10">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 px-3">
          Manage
        </p>
        <nav className="space-y-1">
          {manageItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Log Out */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all mt-3"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}