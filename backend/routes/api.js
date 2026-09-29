const router = require('express').Router();
const Order = require('../models/Order');

// Demo market data (base prices). Real API se replace kar sakte ho.
const BASE = { RELIANCE: 2900, TCS: 3900, INFY: 1550, HDFCBANK: 1650, ITC: 430, SBIN: 780 };
const ltp = s => +(BASE[s] * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2);

router.get('/stocks', (req, res) =>
  res.json(Object.keys(BASE).map(symbol => ({ symbol, price: ltp(symbol) }))));

async function holdings() {
  const orders = await Order.find().sort('createdAt');
  const h = {};
  for (const o of orders) {
    const p = (h[o.symbol] ||= { qty: 0, cost: 0 });
    if (o.type === 'BUY') { p.qty += o.qty; p.cost += o.qty * o.price; }
    else { const avg = p.cost / p.qty; p.qty -= o.qty; p.cost -= avg * o.qty; }
  }
  return h;
}

router.get('/portfolio', async (req, res) => {
  const h = await holdings();
  const positions = Object.entries(h).filter(([, p]) => p.qty > 0).map(([symbol, p]) => {
    const price = ltp(symbol);
    return { symbol, qty: p.qty, avg: +(p.cost / p.qty).toFixed(2), price,
             value: +(p.qty * price).toFixed(2), pnl: +(p.qty * price - p.cost).toFixed(2) };
  });
  res.json({
    positions,
    invested: +positions.reduce((a, p) => a + p.qty * p.avg, 0).toFixed(2),
    value: +positions.reduce((a, p) => a + p.value, 0).toFixed(2),
    pnl: +positions.reduce((a, p) => a + p.pnl, 0).toFixed(2),
  });
});

router.get('/orders', async (req, res) => res.json(await Order.find().sort('-createdAt')));

router.post('/orders', async (req, res) => {
  const { symbol, type, qty } = req.body;
  if (!BASE[symbol] || !['BUY', 'SELL'].includes(type) || !(qty > 0))
    return res.status(400).json({ error: 'Invalid order' });
  if (type === 'SELL') {
    const have = (await holdings())[symbol]?.qty || 0;
    if (qty > have) return res.status(400).json({ error: `Sirf ${have} shares hain` });
  }
  res.status(201).json(await Order.create({ symbol, type, qty, price: ltp(symbol) }));
});

module.exports = router;
