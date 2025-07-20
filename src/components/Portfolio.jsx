import { useState } from "react";

function Portfolio({ portfolioData, setPortfolioData, tickerData }) {
  const [newStock, setNewStock] = useState("");
  const [shares, setShares] = useState("");

  const addStock = () => {
    const symbol = newStock.trim().toUpperCase();
    if (symbol && shares > 0) {
      setPortfolioData((prev) => ({
        ...prev,
        [symbol]: { shares: parseInt(shares) },
      }));
      setNewStock("");
      setShares("");
    }
  };

  const removeStock = (symbol) => {
    setPortfolioData((prev) => {
      const updated = { ...prev };
      delete updated[symbol];
      return updated;
    });
  };

  const totalValue = Object.entries(portfolioData).reduce((acc, [symbol, { shares }]) => {
    const price = tickerData[symbol] || 0;
    return acc + shares * price;
  }, 0);

  return (
    <div className="glass-card">
      <h2>Portfolio</h2>
      <div className="portfolio-input">
        <input
          type="text"
          placeholder="Symbol (e.g. AAPL)"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
        />
        <input
          type="number"
          placeholder="Shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
        />
        <button className="btn btn-add" onClick={addStock}>
          + Add
        </button>
      </div>

      {Object.entries(portfolioData).length > 0 ? (
        <ul>
          {Object.entries(portfolioData).map(([symbol, { shares }]) => (
            <li key={symbol} className="stock-item">
              <span>
                <strong>{symbol}</strong> - {shares} shares @ $
                {tickerData[symbol] ? tickerData[symbol].toFixed(2) : "Loading..."}
              </span>
              <button className="btn btn-remove" onClick={() => removeStock(symbol)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stocks in portfolio.</p>
      )}

      <div className="prediction-box">
        <p>
          <strong>Total Value:</strong> <span className="highlight">${totalValue.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

export default Portfolio;
