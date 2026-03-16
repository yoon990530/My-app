import { useState } from 'react';
import { useStockWatchlist } from '../hooks/useStockWatchlist';
import { useStockNews } from '../hooks/useStockNews';
import WatchlistManager from '../components/Stock/WatchlistManager';
import StockNewsCard from '../components/Stock/StockNewsCard';
import styles from './StockNews.module.css';

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeletonThumb} skeleton`} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.short} skeleton`} />
        <div className={`${styles.skeletonLine} skeleton`} />
        <div className={`${styles.skeletonLine} ${styles.medium} skeleton`} />
      </div>
    </div>
  );
}

export default function StockNews() {
  const { watchlist, addStock, removeStock } = useStockWatchlist();
  const { news, loading, error, lastUpdated, refresh } = useStockNews(watchlist);
  const [filterTicker, setFilterTicker] = useState('ALL');

  const tickers = ['ALL', ...watchlist];
  const filtered =
    filterTicker === 'ALL' ? news : news.filter((n) => n.ticker === filterTicker);

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>주식 뉴스</h1>
          <div className={styles.headerActions}>
            {lastUpdated && (
              <span className={styles.updated}>
                {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 업데이트
              </span>
            )}
            <button
              className={`${styles.refreshBtn} ${loading ? styles.spinning : ''}`}
              onClick={refresh}
              disabled={loading}
              title="새로고침"
            >
              ↻
            </button>
          </div>
        </div>

        <WatchlistManager
          watchlist={watchlist}
          onAdd={addStock}
          onRemove={removeStock}
        />

        {watchlist.length > 0 && (
          <div className={styles.filterBar}>
            {tickers.map((t) => (
              <button
                key={t}
                className={`${styles.filterBtn} ${filterTicker === t ? styles.active : ''}`}
                onClick={() => setFilterTicker(t)}
              >
                {t === 'ALL' ? '전체' : t}
                {t !== 'ALL' && (
                  <span className={styles.count}>
                    {news.filter((n) => n.ticker === t).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        {error && (
          <div className={styles.errorBanner}>{error}</div>
        )}

        {loading ? (
          <div className={styles.newsList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📈</p>
            <p className={styles.emptyText}>관심 종목을 추가하면 뉴스를 모아볼 수 있어요</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🔍</p>
            <p className={styles.emptyText}>뉴스가 없습니다</p>
          </div>
        ) : (
          <div className={styles.newsList}>
            {filtered.map((item) => (
              <StockNewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
