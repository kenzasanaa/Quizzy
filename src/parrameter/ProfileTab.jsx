import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, Save, Users } from 'lucide-react';

export default function ProfileTab() {
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      const data = localStorage.getItem('quizzyProfile');
      return data ? JSON.parse(data) : getDefaultProfile();
    } catch {
      return getDefaultProfile();
    }
  });

  function getDefaultProfile() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      role: 'Teacher',
      bio: 'Science teacher with 10+ years of experience. Passionate about making learning fun and engaging through interactive quizzes.'
    };
  }

  useEffect(() => {
    localStorage.setItem('quizzyProfile', JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    localStorage.setItem('quizzyProfile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white">Profile Information</h2>
        <p className="text-zinc-400 text-xs">Update your profile information and public details</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-[#251836] shadow-xl flex items-center justify-center overflow-hidden">
            <Users className="w-10 h-10 text-zinc-400" />
          </div>
          <button className="flex items-center gap-2 text-[#FF7AB6] text-xs font-semibold hover:opacity-80 transition-opacity">
            <Camera className="w-3.5 h-3.5" /> Change Photo
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First Name" value={profile.firstName} onChange={v => updateField('firstName', v)} />
            <Field label="Last Name" value={profile.lastName} onChange={v => updateField('lastName', v)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" type="email" value={profile.email} onChange={v => updateField('email', v)} />
            <Field label="Role" value={profile.role} disabled />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Bio</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={e => updateField('bio', e.target.value)}
              className="w-full px-4 py-3 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 shadow-lg shadow-[#FF7AB6]/20'
          }`}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', disabled = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors ${
          disabled
            ? 'bg-[#1B1026]/50 border-[#FF7AB6]/10 text-zinc-500 cursor-not-allowed'
            : 'bg-[#1B1026] border-[#FF7AB6]/10 text-white focus:border-[#FF7AB6]/40'
        }`}
      />
    </div>
  );
}