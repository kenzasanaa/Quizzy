import React from 'react';

const TABS = ['Profile', 'Account', 'Notifications', 'Billing'];

export default function SettingsTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#1B1026]/60 rounded-xl p-1 w-max overflow-x-auto max-w-full">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === tab
              ? 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] shadow-md shadow-[#FF7AB6]/20'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}