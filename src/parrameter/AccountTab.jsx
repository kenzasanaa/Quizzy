import React, { useState } from 'react';
import { Lock, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

export default function AccountTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = () => {
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setUpdated(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setUpdated(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure? This will permanently delete your account and all data. This action cannot be undone.')) {
      alert('Account deletion request submitted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Security */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white">Account Security</h2>
        <p className="text-zinc-400 text-xs">Update your password and security settings</p>
      </div>

      <div className="space-y-4 max-w-md">
        <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} />
        <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} />
        <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} />

        {error && (
          <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleUpdatePassword}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            updated
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 shadow-lg shadow-[#FF7AB6]/20'
          }`}
        >
          {updated ? <><CheckCircle2 className="w-4 h-4" /> Updated!</> : 'Update Password'}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#FF7AB6]/10 pt-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-zinc-400 text-xs">Irreversible actions for your account</p>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-400">Delete Account</h3>
              <p className="text-zinc-400 text-xs mt-1">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-zinc-400">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          type="password"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#1B1026] border border-[#FF7AB6]/10 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-[#FF7AB6]/40 transition-colors"
        />
      </div>
    </div>
  );
}