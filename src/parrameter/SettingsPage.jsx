import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../DashBord/Sidebar';
import Header from '../DashBord/Header';
import SettingsTabs from './SettingsTabs';
import ProfileTab from './ProfileTab';
import AccountTab from './AccountTab';
import NotificationsTab from './NotificationsTab';
import BillingTab from './BillingTab';
import ComingSoonTab from './ComingSoonTab';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'teacher';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileTab />;
      case 'Account':
        return <AccountTab />;
      case 'Notifications':
        return <NotificationsTab />;
      case 'Billing':
        return userRole === 'teacher' ? <BillingTab /> : <ComingSoonTab title="Billing" />;
      default:
        return <ComingSoonTab title={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1026] text-zinc-100 flex font-sans overflow-x-hidden">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 flex-col p-6 shrink-0 h-screen sticky top-0">
        <Sidebar activeTab="settings" navigate={navigate} />
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-[#120a1a] border-r border-[#FF7AB6]/10 p-6 z-50 transform translate-x-0 transition-transform duration-300 lg:hidden">
            <Sidebar activeTab="settings" isMobile onClose={() => setIsMobileSidebarOpen(false)} navigate={navigate} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="grow flex flex-col min-h-screen min-w-0">
        <Header 
          userRole={userRole} 
          onMenuClick={() => setIsMobileSidebarOpen(true)} 
          onCreateQuiz={null}  // ← HIDE CREATE QUIZ BUTTON: pass null or undefined
        />

        <div className="grow p-6 sm:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Settings</h1>
            <p className="text-zinc-400 text-sm">Manage your account settings and preferences</p>
          </div>

          <div className="bg-[#251836]/80 border border-[#FF7AB6]/10 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 pt-6 pb-2 border-b border-[#FF7AB6]/10">
              <SettingsTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                userRole={userRole}
              />
            </div>
            <div className="p-6 sm:p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}