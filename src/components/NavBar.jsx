import { clsx } from 'clsx';

export default function NavBar({ items, activeKey, onChange }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-cyan-400 to-emerald-400" />
          <span className="font-semibold tracking-tight">FX Journal</span>
        </div>
        <nav className="flex items-center gap-2">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                activeKey === it.key ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              {it.icon ? <it.icon size={16} /> : null}
              <span className="hidden sm:inline">{it.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
