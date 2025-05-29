const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let orders = [];

// POST /api/orders - Create new order
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

// GET /api/orders - List all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// GET /api/orders/:id - Get single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// PATCH /api/orders/:id - Update status
app.patch('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = req.body.status || order.status;
  order.updatedAt = new Date().toISOString();

  res.json(order);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
