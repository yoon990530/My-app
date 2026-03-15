import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

const MOCK_USER_KEY = 'mock_user';
const MOCK_COUPLE_ID = 'demo-couple';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [coupleId, setCoupleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
      setCoupleId(MOCK_COUPLE_ID);
    }
    setLoading(false);
  }, []);

  async function signIn({ email }) {
    const mockUser = {
      uid: 'user1',
      email,
      displayName: email.split('@')[0],
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setCoupleId(MOCK_COUPLE_ID);
    return mockUser;
  }

  async function signUp({ email, displayName }) {
    const mockUser = {
      uid: 'user1',
      email,
      displayName: displayName || email.split('@')[0],
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setCoupleId(MOCK_COUPLE_ID);
    return mockUser;
  }

  async function logOut() {
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    setCoupleId(null);
  }

  return (
    <AuthContext.Provider value={{ user, coupleId, loading, signUp, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
