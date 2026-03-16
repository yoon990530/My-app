import { useState } from 'react';
import styles from './WatchlistManager.module.css';

export default function WatchlistManager({ watchlist, onAdd, onRemove }) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    const ok = onAdd(input);
    if (ok) {
      setInput('');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  return (
    <div className={styles.container}>
      <form className={`${styles.form} ${shake ? styles.shake : ''}`} onSubmit={handleAdd}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="종목 코드 입력 (예: AAPL)"
          maxLength={10}
        />
        <button className={styles.addBtn} type="submit" disabled={!input.trim()}>
          추가
        </button>
      </form>
      <div className={styles.chips}>
        {watchlist.map((ticker) => (
          <span key={ticker} className={styles.chip}>
            {ticker}
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(ticker)}
              aria-label={`${ticker} 삭제`}
            >
              ×
            </button>
          </span>
        ))}
        {watchlist.length === 0 && (
          <span className={styles.empty}>관심 종목을 추가해보세요</span>
        )}
      </div>
    </div>
  );
}
