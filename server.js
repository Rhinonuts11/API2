const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let orders = [];

// POST /api/orders - Create standard order
app.post('/api/orders', (req, res) => {
  const order = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'standard'
  };
  orders.push(order);
  res.status(201).json(order);
});

// POST /api/table-orders - Create table order
app.post('/api/table-orders', (req, res) => {
  const { tableNumber, items, total, customerName } = req.body;

  if (!tableNumber || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const order = {
    id: uuidv4(),
    tableNumber,
    customer: {
      username: customerName || `Table ${tableNumber}`
    },
    items,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'table'
  };

  orders.push(order);
  res.status(201).json(order);
});

// GET /api/orders - List all orders or filter by type (?type=table or standard)
app.get('/api/orders', (req, res) => {
  const { type } = req.query;
  if (type) {
    return res.json(orders.filter(order => order.type === type));
  }
  res.json(orders);
});

// GET /api/orders/:id - Get specific order
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

// DELETE /api/orders/:id - Delete order (optional)
app.delete('/api/orders/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });

  const deleted = orders.splice(index, 1)[0];
  res.json({ message: 'Order deleted', order: deleted });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
