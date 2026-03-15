import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const CHAT_KEY = 'mock_messages';

const INITIAL_MESSAGES = [
  {
    id: 'msg1',
    senderId: 'user2',
    senderName: '상대방',
    text: '안녕! 오늘 뭐해? 😊',
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'msg2',
    senderId: 'user1',
    senderName: '나',
    text: '집에서 쉬고 있어~ 너는?',
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'msg3',
    senderId: 'user2',
    senderName: '상대방',
    text: '나도! 오늘 같이 영화 볼까? 🎬',
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

function loadMessages() {
  const stored = localStorage.getItem(CHAT_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(CHAT_KEY, JSON.stringify(INITIAL_MESSAGES));
  return INITIAL_MESSAGES;
}

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessages(loadMessages());
    setLoading(false);
  }, []);

  async function sendMessage({ text, file }) {
    let imageUrl = null;
    if (file) {
      imageUrl = URL.createObjectURL(file);
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: user.uid,
      senderName: user.displayName,
      text: text || '',
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem(CHAT_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  return { messages, loading, sendMessage };
}
