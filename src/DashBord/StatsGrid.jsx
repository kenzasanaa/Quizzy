import React from 'react';
import { Calendar, Users, BarChart2, BookOpen } from 'lucide-react';

export default function StatsGrid({ stats = [] }) {
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Calendar':
      case Calendar:
        return Calendar;
      case 'Users':
      case Users:
        return Users;
      case 'BarChart2':
      case BarChart2:
        return BarChart2;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const IconComp = getIconComponent(stat.icon);
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
  );
}