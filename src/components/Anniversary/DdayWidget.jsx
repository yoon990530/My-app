import styles from './DdayWidget.module.css';

function calcDday(startDateStr) {
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1; // D+1 from day 0
}

export default function DdayWidget({ startDate, onSetDate }) {
  if (!startDate) {
    return (
      <div className={styles.notSet}>
        <p className={styles.notSetText}>함께한 날짜를 설정해보세요 💙</p>
        <button className={styles.setBtn} onClick={onSetDate}>설정하기</button>
      </div>
    );
  }

  const dday = calcDday(startDate);
  const formattedStart = new Date(startDate).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={styles.widget}>
      <div className={styles.left}>
        <span className={styles.label}>우리가 함께한 지</span>
        <span className={styles.dday}>D+{dday.toLocaleString()}</span>
        <span className={styles.since}>{formattedStart}부터</span>
      </div>
      <div className={styles.right}>💙</div>
    </div>
  );
}
