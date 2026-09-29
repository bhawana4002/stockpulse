import { useEffect, useState } from 'react';

const color = n => (n >= 0 ? 'text-emerald-400' : 'text-red-400');

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = () => fetch('/api/portfolio').then(r => r.json()).then(setData);
    load();
    const t = setInterval(load, 5000); // live-like refresh
    return () => clearInterval(t);
  }, []);
  if (!data) return <p>Loading...</p>;
  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[['Invested', data.invested], ['Current Value', data.value], ['P&L', data.pnl]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-slate-800 p-4">
            <p className="text-sm text-slate-400">{k}</p>
            <p className={`text-2xl font-semibold ${k === 'P&L' ? color(v) : ''}`}>₹{v}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400"><tr>
            {['Symbol', 'Qty', 'Avg', 'LTP', 'Value', 'P&L'].map(h => <th key={h} className="p-3">{h}</th>)}
          </tr></thead>
          <tbody>
            {data.positions.length === 0 && <tr><td className="p-3" colSpan="6">Koi position nahi hai. Trade page se BUY karo.</td></tr>}
            {data.positions.map(p => (
              <tr key={p.symbol} className="border-t border-slate-700">
                <td className="p-3 font-medium">{p.symbol}</td><td className="p-3">{p.qty}</td>
                <td className="p-3">{p.avg}</td><td className="p-3">{p.price}</td><td className="p-3">{p.value}</td>
                <td className={`p-3 ${color(p.pnl)}`}>{p.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
