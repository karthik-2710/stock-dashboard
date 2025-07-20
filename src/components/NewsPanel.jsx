import { useEffect, useState } from 'react';
import axios from 'axios';

function NewsPanel({ symbol }) {
  const [news, setNews] = useState([]);
  const API_KEY = 'd1uh4rpr01qpci1cjg90d1uh4rpr01qpci1cjg9g'; // Replace with your API key

  useEffect(() => {
    fetchNews(symbol);
  }, [symbol]);

  const fetchNews = async (ticker) => {
    try {
      const res = await axios.get(
        `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=2025-07-01&to=2025-07-20&token=${API_KEY}`
      );
      setNews(res.data.slice(0, 5)); // Top 5 news
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  return (
    <div className="glass-card fade-in">
      <h2 className="text-xl font-bold mb-4">📰 Latest News: {symbol}</h2>
      {news.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <ul>
          {news.map((item, index) => (
            <li key={index} className="mb-3">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {item.headline}
              </a>
              <p className="text-sm text-gray-400">{item.source} - {new Date(item.datetime * 1000).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NewsPanel;
