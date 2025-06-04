const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.post('/api/roblox-proxy', async (req, res) => {
  const { endpoint, apiKey } = req.body;

  if (!endpoint || !apiKey) {
    return res.status(400).json({ error: 'Missing endpoint or API key' });
  }

  try {
    const robloxRes = await fetch(endpoint, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    const data = await robloxRes.json();
    res.status(robloxRes.status).json(data);
  } catch (err) {
    console.error('Roblox proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch Roblox API' });
  }
});

// POST /api/table-orders - Create new table order

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
