import { Home, Plus, List, BarChart3, Menu } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'new', label: 'Add Trade', icon: Plus },
  { key: 'history', label: 'History', icon: List },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activeKey, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed top-4 left-4 z-40 inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-3 py-2 shadow-lg lg:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        <Menu size={18} />
        Menu
      </button>

      <aside
        className={`fixed z-30 top-0 left-0 h-full w-72 border-r border-slate-200 bg-white/80 backdrop-blur transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200">
          <div className="size-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-cyan-400 to-emerald-400" />
          <span className="font-semibold tracking-tight">FX Journal</span>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {NAV.map((it) => (
            <button
              key={it.key}
              onClick={() => {
                onChange?.(it.key);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeKey === it.key ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <it.icon size={18} />
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">Your trades are stored locally in your browser.</p>
        </div>
      </aside>

      <div className="hidden lg:block w-72 shrink-0" aria-hidden />
    </>
  );
}
