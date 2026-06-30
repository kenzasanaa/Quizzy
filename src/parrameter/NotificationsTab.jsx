import React, { useState, useEffect } from 'react';
import { CheckCircle2, Save } from 'lucide-react';

export default function NotificationsTab() {
  const [saved, setSaved] = useState(false);

  const [prefs, setPrefs] = useState(() => {
    try {
      const data = localStorage.getItem('quizzyNotifications');
      return data ? JSON.parse(data) : getDefaultPrefs();
    } catch {
      return getDefaultPrefs();
    }
  });

  function getDefaultPrefs() {
    return {
      emailQuizCompletions: true,
      emailEventReminders: true,
      emailNewStudents: true,
      emailMarketing: false,
      inAppQuizCompletions: true,
      inAppEventReminders: true,
      inAppNewStudents: true,
      frequency: 'immediately'
    };
  }

  useEffect(() => {
    localStorage.setItem('quizzyNotifications', JSON.stringify(prefs));
  }, [prefs]);

  const toggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('quizzyNotifications', JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
        <p className="text-zinc-400 text-xs">Choose how and when you want to be notified</p>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Email Notifications</h3>
        <ToggleRow
          label="Quiz Completions"
          desc="Receive notifications when students complete your quizzes"
          checked={prefs.emailQuizCompletions}
          onChange={() => toggle('emailQuizCompletions')}
        />
        <ToggleRow
          label="Event Reminders"
          desc="Get reminders before your scheduled quiz events"
          checked={prefs.emailEventReminders}
          onChange={() => toggle('emailEventReminders')}
        />
        <ToggleRow
          label="New Student Joins"
          desc="Be notified when new students join your classes"
          checked={prefs.emailNewStudents}
          onChange={() => toggle('emailNewStudents')}
        />
        <ToggleRow
          label="Marketing & Updates"
          desc="Receive news, updates, and promotional emails"
          checked={prefs.emailMarketing}
          onChange={() => toggle('emailMarketing')}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-[#FF7AB6]/10" />

      {/* In-App Notifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">In-App Notifications</h3>
        <ToggleRow
          label="Quiz Completions"
          desc="Receive notifications when students complete your quizzes"
          checked={prefs.inAppQuizCompletions}
          onChange={() => toggle('inAppQuizCompletions')}
        />
        <ToggleRow
          label="Event Reminders"
          desc="Get reminders before your scheduled quiz events"
          checked={prefs.inAppEventReminders}
          onChange={() => toggle('inAppEventReminders')}
        />
        <ToggleRow
          label="New Student Joins"
          desc="Be notified when new students join your classes"
          checked={prefs.inAppNewStudents}
          onChange={() => toggle('inAppNewStudents')}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-[#FF7AB6]/10" />

      {/* Frequency */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Notification Frequency</h3>
        <div className="space-y-2">
          <RadioRow
            label="Immediately"
            checked={prefs.frequency === 'immediately'}
            onChange={() => setPrefs(p => ({ ...p, frequency: 'immediately' }))}
          />
          <RadioRow
            label="Daily Digest"
            checked={prefs.frequency === 'daily'}
            onChange={() => setPrefs(p => ({ ...p, frequency: 'daily' }))}
          />
          <RadioRow
            label="Weekly Digest"
            checked={prefs.frequency === 'weekly'}
            onChange={() => setPrefs(p => ({ ...p, frequency: 'weekly' }))}
          />
        </div>
      </div>

      {/* Save */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 shadow-lg shadow-[#FF7AB6]/20'
          }`}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
        </button>
      </div>
    </div>
  );
}

/* Toggle Switch */
function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
          checked ? 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B]' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

/* Radio Button */
function RadioRow({ label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-3 group"
    >
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked ? 'border-[#FF7AB6]' : 'border-zinc-600 group-hover:border-zinc-500'
      }`}>
        {checked && <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B]" />}
      </div>
      <span className={`text-sm ${checked ? 'text-white font-medium' : 'text-zinc-400'}`}>{label}</span>
    </button>
  );
}