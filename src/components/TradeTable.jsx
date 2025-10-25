import { Trash2 } from 'lucide-react';

export default function TradeTable({ trades, onDelete, compact = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {/* Table for md+ */}
      <table className="hidden md:table min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <Th>Date</Th>
            <Th>Pair</Th>
            <Th>Dir</Th>
            {!compact && <Th>Entry</Th>}
            {!compact && <Th>Stop</Th>}
            {!compact && <Th>Exit</Th>}
            <Th>Pips</Th>
            <Th>R</Th>
            <Th>PnL</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white/70 backdrop-blur">
          {trades.length === 0 && (
            <tr>
              <td colSpan={10} className="p-6 text-center text-slate-500">No trades yet</td>
            </tr>
          )}
          {trades.map((t) => (
            <tr key={t.id} className="hover:bg-white">
              <Td>{new Date(t.date).toLocaleString()}</Td>
              <Td className="font-medium">{t.pair}</Td>
              <Td className={t.direction === 'Long' ? 'text-emerald-700' : 'text-rose-700'}>{t.direction === 'Long' ? 'L' : 'S'}</Td>
              {!compact && <Td>{t.entry}</Td>}
              {!compact && <Td>{t.stop}</Td>}
              {!compact && <Td>{t.exit}</Td>}
              <Td className={t.pips >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{t.pips}</Td>
              <Td>{Number(t.rMultiple).toFixed(2)}</Td>
              <Td className={t.pnl >= 0 ? 'text-emerald-700' : 'text-rose-700'}>${t.pnl}</Td>
              <Td>
                <button onClick={() => onDelete?.(t.id)} className="p-2 rounded hover:bg-slate-100 text-slate-500" title="Delete">
                  <Trash2 size={16} />
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Card list for small screens */}
      <div className="md:hidden bg-white/70 backdrop-blur">
        {trades.length === 0 && (
          <div className="p-6 text-center text-slate-500">No trades yet</div>
        )}
        <ul className="divide-y divide-slate-200">
          {trades.map((t) => (
            <li key={t.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.pair} • <span className={t.direction === 'Long' ? 'text-emerald-700' : 'text-rose-700'}>{t.direction}</span></div>
                  <div className="text-xs text-slate-500">{new Date(t.date).toLocaleString()}</div>
                </div>
                <button onClick={() => onDelete?.(t.id)} className="p-2 rounded hover:bg-slate-100 text-slate-500" aria-label="Delete trade">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                {!compact && (
                  <>
                    <Info label="Entry" value={t.entry} />
                    <Info label="Stop" value={t.stop} />
                    <Info label="Exit" value={t.exit} />
                  </>
                )}
                <Info label="Pips" value={<span className={t.pips >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{t.pips}</span>} />
                <Info label="R" value={Number(t.rMultiple).toFixed(2)} />
                <Info label="PnL" value={<span className={t.pnl >= 0 ? 'text-emerald-700' : 'text-rose-700'}>${t.pnl}</span>} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>;
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}
