import { Trash2 } from 'lucide-react';

export default function TradeTable({ trades, onDelete, compact = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
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
