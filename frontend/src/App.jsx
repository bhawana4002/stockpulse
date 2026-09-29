import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Trade from './pages/Trade.jsx';
import Orders from './pages/Orders.jsx';

const link = ({ isActive }) => `px-3 py-1 rounded ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}`;

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <nav className="flex flex-wrap items-center gap-2 border-b border-slate-700 p-4">
        <h1 className="mr-4 text-xl font-bold text-emerald-400">StockPulse</h1>
        <NavLink to="/" end className={link}>Portfolio</NavLink>
        <NavLink to="/trade" className={link}>Trade</NavLink>
        <NavLink to="/orders" className={link}>Orders</NavLink>
      </nav>
      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}
