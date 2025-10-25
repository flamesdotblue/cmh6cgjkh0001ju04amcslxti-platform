import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import HeroCover from './components/HeroCover';
import TradeForm from './components/TradeForm';
import TradeTable from './components/TradeTable';
import Sidebar from './components/Sidebar';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function computeMultiplier(pair = '') {
  const p = pair.toUpperCase();
  if (p.includes('JPY')) return 100;
  if (p.includes('XAU') || p.includes('GOLD')) return 1;
  return 10000;
}

function computeAnalytics(trades) {
  if (!trades.length) {
    return {
      total: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalPnl: 0,
      avgR: 0,
      equity: [],
    };
  }
  let wins = 0;
  let pnlSum = 0;
  let rSum = 0;
  let rCount = 0;
  const equity = [];
  let running = 0;
  const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  sorted.forEach((t) => {
    const isWin = t.pnl > 0;
    if (isWin) wins += 1;
    pnlSum += t.pnl;
    if (typeof t.rMultiple === 'number' && isFinite(t.rMultiple)) {
      rSum += t.rMultiple;
      rCount += 1;
    }
    running += t.pnl;
    equity.push({ date: t.date, value: running });
  });
  const total = trades.length;
  const losses = total - wins;
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  const avgR = rCount ? rSum / rCount : 0;
  return { total, wins, losses, winRate, totalPnl: pnlSum, avgR, equity };
}

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

function MiniEquityChart({ data }) {
  const width = 600;
  const height = 160;
  const padding = 24;
  if (!data.length) {
    return (
      <div className="h-40 w-full rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-500">
        No equity data yet
      </div>
    );
  }
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });
  const last = values[values.length - 1];
  const first = values[0];
  const color = last >= first ? '#22c55e' : '#ef4444';
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 rounded-xl border border-white/10 bg-white/5">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points.join(' ')} />
      {points.map((p, idx) => (
        <circle key={idx} cx={p.split(',')[0]} cy={p.split(',')[1]} r="2" fill={color} />
      ))}
    </svg>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [trades, setTrades] = useLocalStorage('fxjournal_trades', []);

  const analytics = useMemo(() => computeAnalytics(trades), [trades]);

  const handleAddTrade = (payload) => {
    const multiplier = computeMultiplier(payload.pair);
    const directionSign = payload.direction === 'Long' ? 1 : -1;
    const pips = (payload.exit - payload.entry) * multiplier * directionSign;
    const riskPips = Math.abs(payload.entry - payload.stop) * multiplier;
    const pnl = pips * payload.pipValue;
    const riskUsd = riskPips * payload.pipValue || 1;
    const rMultiple = pnl / riskUsd;

    const trade = {
      id: crypto.randomUUID(),
      date: payload.date,
      pair: payload.pair,
      direction: payload.direction,
      entry: payload.entry,
      stop: payload.stop,
      exit: payload.exit,
      pipValue: payload.pipValue,
      pips: Math.round(pips),
      riskPips: Math.round(riskPips),
      pnl: Math.round(pnl),
      rMultiple: Number.isFinite(rMultiple) ? Number(rMultiple.toFixed(2)) : 0,
      notes: payload.notes || '',
    };
    setTrades((prev) => [trade, ...prev]);
    setPage('history');
  };

  const removeTrade = (id) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white/40 text-slate-900">
      <div className="flex">
        <Sidebar activeKey={page} onChange={setPage} />
        <main className="flex-1 min-h-screen ml-0 lg:ml-0 px-6 pb-12 lg:pl-72">
          {page === 'dashboard' && (
            <>
              <div className="pt-6 lg:pt-8">
                <HeroCover />
              </div>
              <section className="mx-auto max-w-6xl -mt-24 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Total Trades</div>
                    <div className="text-3xl font-semibold mt-1">{analytics.total}</div>
                  </div>
                  <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Win Rate</div>
                    <div className="text-3xl font-semibold mt-1">{analytics.winRate}%</div>
                  </div>
                  <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Net PnL</div>
                    <div className={`text-3xl font-semibold mt-1 ${analytics.totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(analytics.totalPnl)}</div>
                  </div>
                  <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Avg R Multiple</div>
                    <div className="text-3xl font-semibold mt-1">{analytics.avgR.toFixed(2)}</div>
                  </div>
                </div>
                <div className="mt-6">
                  <MiniEquityChart data={analytics.equity} />
                </div>
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Recent Trades</h3>
                    <button onClick={() => setPage('history')} className="text-sm text-slate-600 hover:text-slate-900">View all</button>
                  </div>
                  <TradeTable trades={trades.slice(0, 5)} onDelete={removeTrade} compact />
                </div>
              </section>
            </>
          )}

          {page === 'new' && (
            <section className="mx-auto max-w-3xl py-10">
              <h2 className="text-2xl font-semibold mb-4">Add New Trade</h2>
              <TradeForm onSubmit={handleAddTrade} />
            </section>
          )}

          {page === 'history' && (
            <section className="mx-auto max-w-6xl py-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Trade History</h2>
                <button onClick={() => setPage('new')} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
                  <Plus size={16} /> New Trade
                </button>
              </div>
              <TradeTable trades={trades} onDelete={removeTrade} />
            </section>
          )}

          {page === 'analytics' && (
            <section className="mx-auto max-w-6xl py-10">
              <h2 className="text-2xl font-semibold">Analytics</h2>
              <p className="text-slate-600 mb-6">High-level performance metrics derived from your journaled trades.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Wins / Losses</div>
                  <div className="text-3xl font-semibold">{analytics.wins} / {analytics.losses}</div>
                </div>
                <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Best Trade (R)</div>
                  <div className="text-3xl font-semibold">{(() => {
                    if (!trades.length) return '0.00';
                    const best = Math.max(...trades.map(t => t.rMultiple ?? 0));
                    return Number.isFinite(best) ? best.toFixed(2) : '0.00';
                  })()}</div>
                </div>
                <div className="rounded-xl bg-white/70 backdrop-blur border border-slate-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Worst Trade (R)</div>
                  <div className="text-3xl font-semibold">{(() => {
                    if (!trades.length) return '0.00';
                    const worst = Math.min(...trades.map(t => t.rMultiple ?? 0));
                    return Number.isFinite(worst) ? worst.toFixed(2) : '0.00';
                  })()}</div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Equity Curve</h3>
                <MiniEquityChart data={analytics.equity} />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Performance By Pair</h3>
                <PairBars trades={trades} />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function PairBars({ trades }) {
  if (!trades.length) return (
    <div className="h-40 w-full rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-500">No data</div>
  );
  const map = new Map();
  trades.forEach((t) => {
    const key = t.pair.toUpperCase();
    map.set(key, (map.get(key) || 0) + (t.pnl || 0));
  });
  const items = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...items.map(([, v]) => Math.abs(v))) || 1;
  return (
    <div className="space-y-2">
      {items.map(([pair, val]) => (
        <div key={pair} className="flex items-center gap-3">
          <div className="w-20 text-sm text-slate-600">{pair}</div>
          <div className="flex-1 h-6 bg-white/60 rounded overflow-hidden">
            <div
              className={`h-full ${val >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${(Math.abs(val) / max) * 100}%` }}
            />
          </div>
          <div className={`w-24 text-right text-sm ${val >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{formatCurrency(val)}</div>
        </div>
      ))}
    </div>
  );
}
