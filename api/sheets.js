const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7gRGFqmOi5UDiHpjP81Co3Eig-tJZtd8rIkaLhAnQvGzUe7cqmIGMGGoalB7uSuDv/exec';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const upstream = await fetch(APPS_SCRIPT_URL, {
        method: 'GET',
        redirect: 'follow',
      });
      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(text);

    } else if (req.method === 'POST') {
      const rawBody = await new Promise((resolve, reject) => {
        let chunks = '';
        req.on('data', chunk => { chunks += chunk.toString(); });
        req.on('end', () => resolve(chunks));
        req.on('error', reject);
      });

      const upstream = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: rawBody,
        redirect: 'follow',
      });
      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(text);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
