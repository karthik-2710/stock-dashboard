import React from "react";

const NewsPanel = ({ news, symbol }) => {
  if (!news) return <div className="glass-card">Loading news...</div>;

  return (
    <div className="glass-card fade-in" style={{ minHeight: 'auto', padding: '1rem' }}>
      <h2 className="text-xl font-bold mb-4">📰 Latest News: {symbol}</h2>
      {news.length === 0 ? (
        <p>No recent news found.</p>
      ) : (
        <ul className="space-y-2">
          {news.map((item, index) => (
            <li key={index} className="border-b border-gray-600 pb-2">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-300">
                <strong>{item.title}</strong>
              </a>
              <p className="text-sm text-gray-400">{item.source?.name || "Unknown Source"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsPanel;
