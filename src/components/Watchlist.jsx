import { useState } from "react";
import "./Watchlist.css";

function Watchlist({ watchlist = [], setWatchlist = () => {}, watchlistData = {} }) {
  const [newStock, setNewStock] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const addStock = () => {
    const symbol = newStock.trim().toUpperCase();
    if (symbol && !watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setNewStock("");
    }
  };

  const removeStock = (symbol) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const sortedStocks = [...watchlist].sort((a, b) => {
    if (!watchlistData[a] || !watchlistData[b]) return 0;
    if (sortBy === "name") {
      return watchlistData[a].name.localeCompare(watchlistData[b].name);
    } else if (sortBy === "price") {
      return watchlistData[b].price - watchlistData[a].price;
    }
    return 0;
  });

  return (
    <div className="watchlist-container">
      <h2 className="watchlist-title">Your Watchlist</h2>

      {/* Add Stock Section */}
      <div className="add-stock">
        <input
          type="text"
          className="input-symbol"
          placeholder="Enter stock symbol (e.g. AMZN)"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
        />
        <button className="btn btn-add" onClick={addStock}>
          + Add
        </button>
      </div>

      {/* Sorting Section */}
      <div className="sort-section">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-symbol"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      {/* Watchlist Items */}
      <ul className="watchlist">
        {sortedStocks.length === 0 ? (
          <li className="empty-watchlist">No stocks in your watchlist.</li>
        ) : (
          sortedStocks.map((s) => (
            <li className="watchlist-item" key={s}>
              {watchlistData[s] ? (
                <>
                  <div className="stock-info">
                    <span className="stock-symbol">{s}</span>
                    <span className="stock-name">{watchlistData[s].name}</span>
                  </div>
                  <div className="stock-prices">
                    <span className="current-price">
                      ${watchlistData[s].price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeStock(s)}
                  >
                    ✖
                  </button>
                </>
              ) : (
                <span className="loading">Loading {s}...</span>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Watchlist;
