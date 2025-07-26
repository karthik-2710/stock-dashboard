import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import StockChart from "./components/StockChart";
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";
import Ticker from "./components/Ticker";
import NewsPanel from "./components/NewsPanel";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const [watchlist, setWatchlist] = useState(["AAPL", "TSLA", "MSFT"]);
  const [watchlistData, setWatchlistData] = useState({});
  const [portfolioData, setPortfolioData] = useState({});
  const [tickerData, setTickerData] = useState({});

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

      try {
        const predRes = await axios.get(
          `http://localhost:5000/api/predict/${symbol}`
        );
        setPrediction(predRes.data.predicted_price);
      } catch (err) {
        console.error("Error fetching prediction:", err);
        setPrediction(null);
      }
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

  const Dashboard = () => (
    <div className="dashboard">
      <header className="app-header">
        <Navbar />
        <div className="ticker-container">
          <Ticker tickerData={tickerData} />
        </div>
      </header>

      <aside className="left-panel">
        <Watchlist
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          watchlistData={watchlistData}
        />
      </aside>

      <section className="center-panel">
        <div className="symbol-input">
          <input
            type="text"
            placeholder="Enter Stock Symbol (e.g., AMZN)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
          <button onClick={() => fetchStockData(symbol)}>Fetch</button>
        </div>

        <StockChart symbol={symbol} stockData={stockData} labels={labels} />

        {prediction && (
          <div className="prediction-box">
            <p>
              Predicted next price:{" "}
              <span className="highlight">${prediction}</span>
            </p>
          </div>
        )}

        <NewsPanel symbol={symbol} />
      </section>

      <aside className="right-panel">
        <Portfolio
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          tickerData={tickerData}
        />
      </aside>

      <footer className="app-footer">
        <p>AI Stock Dashboard © 2025 | Built by .G</p>
      </footer>
    </div>
  );

  return (
    <BrowserRouter>
      <Navbar /> {/* Always visible */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/watchlist"
          element={
            <div className="page-container">
              <h2>Watchlist</h2>
              <Watchlist
                watchlist={watchlist}
                setWatchlist={setWatchlist}
                watchlistData={watchlistData}
              />
            </div>
          }
        />
        <Route
          path="/portfolio"
          element={
            <div className="page-container">
              <h2>Portfolio</h2>
              <Portfolio
                portfolioData={portfolioData}
                setPortfolioData={setPortfolioData}
                tickerData={tickerData}
              />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
