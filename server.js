const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let orders = [];
let tableOrders = [];

// POST /api/orders - Create new counter order
app.post('/api/orders', (req, res) => {
  const order = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

// POST /api/table-orders - Create new table order
app.post('/api/table-orders', (req, res) => {
  const tableOrder = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tableOrders.push(tableOrder);
  res.status(201).json(tableOrder);
});

// GET /api/orders - List all counter orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// GET /api/table-orders - List all table orders
app.get('/api/table-orders', (req, res) => {
  res.json(tableOrders);
});

// GET /api/orders/:id - Get single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// PATCH /api/orders/:id - Update order status
app.patch('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = req.body.status || order.status;
  order.updatedAt = new Date().toISOString();

  res.json(order);
});

// --- Dashboard Stats Endpoints ---

// GET /api/stats/orders
app.get('/api/stats/orders', (req, res) => {
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  res.json({
    totalOrders,
    completedOrders,
    pendingOrders,
    totalRevenue,
  });
});

// GET /api/stats/inventory (placeholder for now)
app.get('/api/stats/inventory', (req, res) => {
  res.json({
    totalItems: 128,
    lowStockItems: 5,
    totalValue: 32000,
  });
});

// GET /api/stats/sales - 7-day sales overview
app.get('/api/stats/sales', (req, res) => {
  const days = 7;
  const labels = [];
  const values = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toISOString().split('T')[0];

    labels.push(label);
    const dailySales = orders
      .filter(o => o.createdAt.startsWith(label))
      .reduce((sum, o) => sum + (o.total || 0), 0);
    values.push(dailySales);
  }

  res.json({ labels, values });
});

// GET /api/logs/recent-orders - Activity log
app.get('/api/logs/recent-orders', (req, res) => {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(o => ({
      playerName: o.customer || 'Unknown',
      timestamp: o.createdAt,
    }));
  res.json(recent);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
