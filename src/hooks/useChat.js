import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useChat() {
  const { user, coupleId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId) return;
    const q = query(
      collection(db, 'couples', coupleId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [coupleId]);

  async function sendMessage({ text, file }) {
    let imageUrl = null;
    if (file) {
      const path = `couples/${coupleId}/chat/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'couples', coupleId, 'messages'), {
      senderId: user.uid,
      senderName: user.displayName,
      text: text || '',
      imageUrl,
      createdAt: serverTimestamp(),
    });
  }

  return { messages, loading, sendMessage };
}
