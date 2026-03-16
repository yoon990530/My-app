import { useState, useEffect } from 'react';

const STORAGE_KEY = 'stock_watchlist';

const DEFAULT_STOCKS = ['AAPL', 'TSLA', 'NVDA', 'MSFT'];

export function useStockWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STOCKS;
    } catch {
      return DEFAULT_STOCKS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  function addStock(ticker) {
    const upper = ticker.trim().toUpperCase();
    if (!upper || watchlist.includes(upper)) return false;
    setWatchlist((prev) => [...prev, upper]);
    return true;
  }

  function removeStock(ticker) {
    setWatchlist((prev) => prev.filter((t) => t !== ticker));
  }

  return { watchlist, addStock, removeStock };
}
