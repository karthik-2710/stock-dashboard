// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5d&interval=1d`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
