import { useState, useEffect, createContext, useContext } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { validateInviteCode, joinCouple } from '../lib/inviteCode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [coupleId, setCoupleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setCoupleId(userDoc.exists() ? userDoc.data().coupleId : null);
      } else {
        setUser(null);
        setCoupleId(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signUp({ email, password, displayName, inviteCode }) {
    const codeData = await validateInviteCode(inviteCode);
    if (!codeData) throw new Error('유효하지 않은 초대 코드입니다.');

    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });

    const couple = await joinCouple(codeData.coupleId, newUser.uid);

    await setDoc(doc(db, 'users', newUser.uid), {
      displayName,
      email,
      coupleId: couple.id,
      createdAt: new Date(),
    });

    setCoupleId(couple.id);
    return newUser;
  }

  async function signIn({ email, password }) {
    const { user: signedUser } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', signedUser.uid));
    setCoupleId(userDoc.exists() ? userDoc.data().coupleId : null);
    return signedUser;
  }

  async function logOut() {
    await signOut(auth);
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
