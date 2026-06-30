import React from 'react';
import { Settings } from 'lucide-react';

export default function ComingSoonTab({ title }) {
  return (
    <div className="text-center py-16">
      <Settings className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">{title} Settings</h3>
      <p className="text-zinc-400 text-sm">This section is coming soon.</p>
    </div>
  );
}