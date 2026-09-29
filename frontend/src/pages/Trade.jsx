import { useEffect, useState } from 'react';

export default function Trade() {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ symbol: 'RELIANCE', type: 'BUY', qty: 1 });
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch('/api/stocks').then(r => r.json()).then(setStocks); }, []);

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, qty: Number(form.qty) }),
    });
    const d = await res.json();
    setMsg(res.ok ? `✅ ${d.type} ${d.qty} ${d.symbol} @ ₹${d.price}` : `❌ ${d.error}`);
  };
  const input = 'w-full rounded bg-slate-700 p-2';
  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-lg bg-slate-800 p-6">
      <h2 className="text-lg font-semibold">Place Order</h2>
      <select className={input} value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })}>
        {stocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} — ₹{s.price}</option>)}
      </select>
      <select className={input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option>BUY</option><option>SELL</option>
      </select>
      <input className={input} type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
      <button className="w-full rounded bg-emerald-600 p-2 font-semibold hover:bg-emerald-500">Submit</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
