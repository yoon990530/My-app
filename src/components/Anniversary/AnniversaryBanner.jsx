import styles from './AnniversaryBanner.module.css';

function calcNextDate(dateStr, repeat) {
  const base = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!repeat) {
    base.setHours(0, 0, 0, 0);
    return base;
  }

  // Find next occurrence this year or next year
  const next = new Date(today.getFullYear(), base.getMonth(), base.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  return next;
}

function formatDday(target) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '오늘!';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export default function AnniversaryBanner({ anniversary, onDelete }) {
  const nextDate = calcNextDate(anniversary.date, anniversary.repeat);
  const formattedDate = nextDate.toLocaleDateString('ko-KR', {
    month: 'long', day: 'numeric',
  });
  const dday = formatDday(nextDate);

  const ICONS = {
    birthday: '🎂',
    anniversary: '💍',
    first_met: '💙',
    travel: '✈️',
    other: '⭐',
  };
  const icon = ICONS[anniversary.type] || '⭐';

  return (
    <div className={styles.banner}>
      <div className={styles.left}>
        <span className={styles.icon}>{icon}</span>
        <div className={styles.info}>
          <p className={styles.name}>{anniversary.name}</p>
          <p className={styles.date}>{formattedDate}{anniversary.repeat ? ' (매년)' : ''}</p>
        </div>
      </div>
      <span className={styles.dday}>{dday}</span>
      <button className={styles.deleteBtn} onClick={() => onDelete(anniversary.id)}>삭제</button>
    </div>
  );
}
