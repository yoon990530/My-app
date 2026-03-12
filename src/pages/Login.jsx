import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    inviteCode: '',
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await signIn({ email: form.email, password: form.password });
      } else {
        await signUp({
          email: form.email,
          password: form.password,
          displayName: form.displayName,
          inviteCode: form.inviteCode,
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.card} page-enter`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>💙</div>
          <h1 className={styles.title}>우리만의 공간</h1>
          <p className={styles.subtitle}>두 사람만을 위한 프라이빗 SNS</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            로그인
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            회원가입
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              className={styles.input}
              type="text"
              name="displayName"
              placeholder="이름"
              value={form.displayName}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          )}
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {mode === 'signup' && (
            <>
              <input
                className={styles.input}
                type="text"
                name="inviteCode"
                placeholder="초대 코드 (대소문자 무관)"
                value={form.inviteCode}
                onChange={handleChange}
                required
                autoCapitalize="characters"
              />
              <p className={styles.inviteHint}>파트너에게 받은 초대 코드를 입력하세요.</p>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
