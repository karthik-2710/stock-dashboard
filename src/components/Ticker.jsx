function Ticker({ tickerData }) {
  const defaultData = {
    AAPL: 211.18,
    TSLA: 329.65,
    MSFT: 510.05,
    AMZN: 226.13
  };

  const data = tickerData && Object.keys(tickerData).length ? tickerData : defaultData;

  return (
    <div className="ticker-text">
      {Object.entries(data).map(([symbol, price]) => (
        <span key={symbol} style={{ marginRight: "2rem" }}>
          {symbol}: ${price}
        </span>
      ))}
    </div>
  );
}

export default Ticker;
