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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
