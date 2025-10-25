import { useState } from 'react';

export default function TradeForm({ onSubmit }) {
  const now = new Date();
  const initialDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [form, setForm] = useState({
    date: initialDate,
    pair: 'EURUSD',
    direction: 'Long',
    entry: '',
    stop: '',
    exit: '',
    pipValue: 10,
    notes: '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      entry: parseFloat(form.entry),
      stop: parseFloat(form.stop),
      exit: parseFloat(form.exit),
      pipValue: parseFloat(form.pipValue),
      date: new Date(form.date).toISOString(),
    };
    if (
      !payload.pair ||
      !payload.direction ||
      !Number.isFinite(payload.entry) ||
      !Number.isFinite(payload.stop) ||
      !Number.isFinite(payload.exit) ||
      !Number.isFinite(payload.pipValue)
    ) {
      alert('Please fill all numeric fields correctly.');
      return;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Date & Time</label>
          <input type="datetime-local" value={form.date} onChange={(e) => update('date', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Pair</label>
          <input placeholder="EURUSD" value={form.pair} onChange={(e) => update('pair', e.target.value.toUpperCase())} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Direction</label>
          <select value={form.direction} onChange={(e) => update('direction', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white">
            <option>Long</option>
            <option>Short</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Entry</label>
          <input type="number" step="0.0001" value={form.entry} onChange={(e) => update('entry', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Stop</label>
          <input type="number" step="0.0001" value={form.stop} onChange={(e) => update('stop', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Exit</label>
          <input type="number" step="0.0001" value={form.exit} onChange={(e) => update('exit', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Pip Value ($/pip)</label>
          <input type="number" step="0.01" value={form.pipValue} onChange={(e) => update('pipValue', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Notes</label>
        <textarea rows={4} value={form.notes} onChange={(e) => update('notes', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white" placeholder="Setup, confluence, emotions, management..." />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
          Save Trade
        </button>
        <p className="text-sm text-slate-600">Your trades are stored locally in your browser.</p>
      </div>
    </form>
  );
}
