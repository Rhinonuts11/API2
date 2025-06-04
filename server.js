// /api/proxyRoblox.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/roblox/proxy', async (req, res) => {
  const { endpoint, apiKey } = req.body;

  if (!endpoint || !apiKey) {
    return res.status(400).json({ error: 'Missing endpoint or API key' });
  }

  try {
    const robloxRes = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey }
    });

    const data = await robloxRes.json();
    res.status(robloxRes.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server failed to fetch Roblox API' });
  }
});

app.listen(3001, () => console.log('Proxy server listening on port 3001'));
