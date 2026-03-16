import { useState, useEffect, useCallback } from 'react';

// rss2json API converts Yahoo Finance RSS to JSON and handles CORS
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';
const YF_RSS = (ticker) =>
  `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;

async function fetchNewsForTicker(ticker) {
  const url = `${RSS2JSON}${encodeURIComponent(YF_RSS(ticker))}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(data.message || 'RSS error');
  return (data.items || []).map((item) => ({
    id: item.guid || item.link,
    ticker,
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    description: item.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
    thumbnail: item.thumbnail || item.enclosure?.link || null,
    source: item.author || 'Yahoo Finance',
  }));
}

export function useStockNews(watchlist) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!watchlist.length) {
      setNews([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        watchlist.map((t) => fetchNewsForTicker(t))
      );
      const allNews = [];
      const failedTickers = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          allNews.push(...r.value);
        } else {
          failedTickers.push(watchlist[i]);
        }
      });
      // Sort by date, newest first
      allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      setNews(allNews);
      if (failedTickers.length) {
        setError(`일부 종목 뉴스를 불러오지 못했습니다: ${failedTickers.join(', ')}`);
      }
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [watchlist.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { news, loading, error, lastUpdated, refresh: fetchAll };
}
