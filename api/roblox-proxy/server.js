const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/roblox-proxy', async (req, res) => {
  const { endpoint, apiKey } = req.body;

  if (!endpoint || !apiKey) {
    return res.status(400).json({ error: 'Missing endpoint or API key' });
  }

  // Basic URL validation — ensure it's a valid Roblox API URL (optional)
  try {
    const url = new URL(endpoint);
    // Example: restrict to roblox.com domains only
    if (!url.hostname.endsWith('roblox.com')) {
      return res.status(400).json({ error: 'Invalid endpoint URL' });
    }
  } catch {
    return res.status(400).json({ error: 'Malformed endpoint URL' });
  }

  try {
    const robloxRes = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey },
    });

    // Try to parse JSON, fallback to text if JSON fails
    let data;
    const contentType = robloxRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await robloxRes.json();
    } else {
      data = await robloxRes.text();
    }

    res.status(robloxRes.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server failed to fetch Roblox API' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
