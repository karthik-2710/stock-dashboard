import { useState } from 'react';

function Watchlist({ watchlist = [], setWatchlist = () => {}, watchlistData = {} }) {
  const [newStock, setNewStock] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const addStock = () => {
    const symbol = newStock.trim().toUpperCase();
    if (symbol && !watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setNewStock('');
    }
  };

  const removeStock = (symbol) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const sortedStocks = [...watchlist].sort((a, b) => {
    if (!watchlistData[a] || !watchlistData[b]) return 0;
    if (sortBy === 'name') {
      return watchlistData[a].name.localeCompare(watchlistData[b].name);
    } else if (sortBy === 'price') {
      return watchlistData[b].price - watchlistData[a].price;
    }
    return 0;
  });

  return (
    <div className="glass-card watchlist">
      <h2>Watchlist</h2>

      <div className="flex gap-2 mb-4">
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

      <div className="flex gap-2 mb-4 items-center">
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

      <ul>
        {sortedStocks.length === 0 ? (
          <li>No stocks in your watchlist.</li>
        ) : (
          sortedStocks.map((s) => (
            <li key={s} className="stock-item">
              {watchlistData[s] ? (
                <>
                  <span>
                    <strong>{watchlistData[s].name}</strong>: ${watchlistData[s].price.toFixed(2)}
                  </span>
                  <button className="btn btn-remove" onClick={() => removeStock(s)}>
                    Remove
                  </button>
                </>
              ) : (
                <span>Loading {s}...</span>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Watchlist;
