import { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { fetch('/api/orders').then(r => r.json()).then(setOrders); }, []);
  return (
    <div className="overflow-x-auto rounded-lg bg-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400"><tr>{['Time', 'Symbol', 'Type', 'Qty', 'Price'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{orders.map(o => (
          <tr key={o._id} className="border-t border-slate-700">
            <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td><td className="p-3">{o.symbol}</td>
            <td className={`p-3 ${o.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{o.type}</td>
            <td className="p-3">{o.qty}</td><td className="p-3">{o.price}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}
