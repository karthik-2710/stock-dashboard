import { useState, useEffect } from "react";
import axios from "axios";

import StockChart from "./components/StockChart";
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";
import Ticker from "./components/Ticker";
import NewsPanel from "./components/NewsPanel";

import "./App.css";

function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const [watchlist, setWatchlist] = useState(["AAPL", "TSLA", "MSFT"]);
  const [watchlistData, setWatchlistData] = useState({});

  // Portfolio state
  const [portfolioData, setPortfolioData] = useState({});
  const [tickerData, setTickerData] = useState({}); // For live ticker prices

  // Fetch data on load
  useEffect(() => {
    fetchStockData(symbol);
    fetchWatchlistData();
  }, [symbol, watchlist]);

  const fetchStockData = async (symbol) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
      const timestamps = res.data.chart.result[0].timestamp;
      const prices = res.data.chart.result[0].indicators.quote[0].close;

      setLabels(timestamps.map((ts) => new Date(ts * 1000).toLocaleDateString()));
      setStockData(prices);

      // Fake AI prediction
      setPrediction(
        (prices[prices.length - 1] * (1 + Math.random() * 0.02)).toFixed(2)
      );
    } catch (err) {
      console.error("Error fetching stock data:", err);
    }
  };

  const fetchWatchlistData = async () => {
    const newData = {};
    for (let s of watchlist) {
      try {
        const res = await axios.get(`http://localhost:5000/api/stock/${s}`);
        const meta = res.data.chart.result[0].meta;
        const lastClose =
          res.data.chart.result[0].indicators.quote[0].close.slice(-1)[0];
        newData[s] = {
          name: meta.longName || s,
          price: lastClose,
        };
      } catch (err) {
        console.error(`Error fetching ${s}:`, err);
      }
    }
    setWatchlistData(newData);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="app-header">
  <h1>📈 AI Stock Dashboard</h1>
  <div className="ticker-container">
    <Ticker tickerData={tickerData} />
  </div>
</header>

      {/* Main Layout */}
      <main>
        {/* Left Sidebar */}
        <div className="left-panel">
          <Watchlist
            watchlist={watchlist}
            setWatchlist={setWatchlist}
            watchlistData={watchlistData}
          />
        </div>

        {/* Center Content */}
        <div className="center-panel">
          <div className="symbol-input">
            <input
              type="text"
              placeholder="Enter Stock Symbol (e.g., AMZN)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <button onClick={() => fetchStockData(symbol)}>Fetch</button>
          </div>

          {/* Chart */}
          <StockChart symbol={symbol} stockData={stockData} labels={labels} />

          {/* Prediction */}
          {prediction && (
            <div className="prediction-box">
              <p>
                Next day price:{" "}
                <span className="highlight">${prediction}</span>
              </p>
            </div>
          )}

          {/* News Panel */}
          <NewsPanel symbol={symbol} />
        </div>

        {/* Right Sidebar */}
        <div className="right-panel">
          <Portfolio
            portfolioData={portfolioData}
            setPortfolioData={setPortfolioData}
            tickerData={tickerData}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>AI Stock Dashboard © 2025 | Built by .G</p>
      </footer>
    </div>
  );
}

export default App;
