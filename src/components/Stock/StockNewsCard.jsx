import styles from './StockNewsCard.module.css';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function StockNewsCard({ item }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      {item.thumbnail && (
        <div className={styles.thumbnail}>
          <img src={item.thumbnail} alt="" loading="lazy" />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.ticker}>{item.ticker}</span>
          <span className={styles.source}>{item.source}</span>
          <span className={styles.time}>{timeAgo(item.pubDate)}</span>
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        {item.description && (
          <p className={styles.desc}>{item.description}</p>
        )}
      </div>
    </a>
  );
}
