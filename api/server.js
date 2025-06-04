// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

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
        'Content-Type': 'application/json'
      }
    });

    const contentType = robloxRes.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await robloxRes.json() : await robloxRes.text();

    res.status(robloxRes.status).json(isJson ? data : { data });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch from Roblox API' });
  }
});

app.get('/', (req, res) => {
  res.send('Roblox Proxy API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Roblox Proxy Server running on port ${PORT}`);
});
