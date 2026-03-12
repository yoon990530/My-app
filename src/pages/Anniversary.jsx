import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import DdayWidget from '../components/Anniversary/DdayWidget';
import AnniversaryBanner from '../components/Anniversary/AnniversaryBanner';
import styles from './Anniversary.module.css';

export default function Anniversary() {
  const { coupleId } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [anniversaries, setAnniversaries] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [form, setForm] = useState({ name: '', date: '', type: 'anniversary', repeat: true });
  const [adding, setAdding] = useState(false);

  // Load couple start date
  useEffect(() => {
    if (!coupleId) return;
    getDoc(doc(db, 'couples', coupleId)).then((snap) => {
      if (snap.exists()) setStartDate(snap.data().startDate || '');
    });
  }, [coupleId]);

  // Load anniversaries
  useEffect(() => {
    if (!coupleId) return;
    const q = query(
      collection(db, 'couples', coupleId, 'anniversaries'),
      orderBy('date', 'asc')
    );
    return onSnapshot(q, (snap) => {
      setAnniversaries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [coupleId]);

  async function saveStartDate() {
    if (!tempDate) return;
    await updateDoc(doc(db, 'couples', coupleId), { startDate: tempDate });
    setStartDate(tempDate);
    setShowDateModal(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name || !form.date) return;
    setAdding(true);
    try {
      await addDoc(collection(db, 'couples', coupleId, 'anniversaries'), {
        name: form.name,
        date: form.date,
        type: form.type,
        repeat: form.repeat,
      });
      setForm({ name: '', date: '', type: 'anniversary', repeat: true });
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, 'couples', coupleId, 'anniversaries', id));
  }

  return (
    <div className={`${styles.page} page-enter`}>
      <h1 className={styles.pageTitle}>기념일</h1>

      <DdayWidget
        startDate={startDate}
        onSetDate={() => { setTempDate(''); setShowDateModal(true); }}
      />

      {startDate && (
        <button
          style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 24, marginTop: -12 }}
          onClick={() => { setTempDate(startDate); setShowDateModal(true); }}
        >
          만난 날 수정
        </button>
      )}

      <div className={styles.addCard}>
        <p className={styles.addTitle}>기념일 추가</p>
        <form className={styles.form} onSubmit={handleAdd}>
          <input
            className={styles.input}
            type="text"
            placeholder="이름 (예: 생일, 100일)"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            maxLength={30}
          />
          <input
            className={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
          <select
            className={styles.select}
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="anniversary">💍 기념일</option>
            <option value="birthday">🎂 생일</option>
            <option value="first_met">💙 처음 만난 날</option>
            <option value="travel">✈️ 여행</option>
            <option value="other">⭐ 기타</option>
          </select>
          <div className={styles.checkRow}>
            <input
              type="checkbox"
              id="repeat"
              checked={form.repeat}
              onChange={(e) => setForm((p) => ({ ...p, repeat: e.target.checked }))}
            />
            <label className={styles.checkLabel} htmlFor="repeat">매년 반복</label>
          </div>
          <button
            className={styles.addBtn}
            type="submit"
            disabled={adding || !form.name || !form.date}
          >
            {adding ? '추가 중...' : '추가하기'}
          </button>
        </form>
      </div>

      {anniversaries.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>등록된 기념일</p>
          <div className={styles.list}>
            {anniversaries.map((a) => (
              <AnniversaryBanner
                key={a.id}
                anniversary={a}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {showDateModal && (
        <div className={styles.dateModal} onClick={(e) => e.target === e.currentTarget && setShowDateModal(false)}>
          <div className={styles.dateModalCard}>
            <p className={styles.dateModalTitle}>만난 날 설정</p>
            <p className={styles.dateModalSub}>함께한 첫날을 선택하세요</p>
            <input
              className={styles.input}
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <div className={styles.dateModalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDateModal(false)}>취소</button>
              <button className={styles.confirmBtn} onClick={saveStartDate} disabled={!tempDate}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
