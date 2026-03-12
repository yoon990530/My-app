import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import styles from './ChatPanel.module.css';

function formatTime(ts) {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function ChatPanel({ fullPage = false }) {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleImageChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSend() {
    if (!text.trim() && !imageFile) return;
    setSending(true);
    try {
      await sendMessage({ text: text.trim(), file: imageFile });
      setText('');
      removeImage();
      textRef.current?.focus();
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Group messages by date
  let lastDate = '';

  const panelClass = fullPage ? styles.panelFull : styles.panel;

  return (
    <div className={panelClass}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>💬 채팅</p>
        <p className={styles.headerSub}>우리 둘만의 대화</p>
      </div>

      <div className={styles.messages}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            불러오는 중...
          </p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            첫 메시지를 보내보세요 💙
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user?.uid;
            const dateStr = formatDate(msg.createdAt);
            const showDate = dateStr !== lastDate;
            if (showDate) lastDate = dateStr;

            return (
              <div key={msg.id}>
                {showDate && (
                  <p className={styles.dateDivider}>{dateStr}</p>
                )}
                <div className={`${styles.messageGroup} ${isMine ? styles.mine : styles.theirs}`}>
                  {msg.imageUrl && (
                    <div className={styles.bubbleImage}>
                      <img src={msg.imageUrl} alt="이미지" />
                    </div>
                  )}
                  {msg.text && (
                    <div className={styles.bubble}>{msg.text}</div>
                  )}
                  <span className={styles.bubbleTime}>{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {imagePreview && (
        <div className={styles.previewArea}>
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="미리보기" />
            <button className={styles.removePreview} onClick={removeImage}>×</button>
          </div>
        </div>
      )}

      <div className={styles.inputArea}>
        <label className={styles.imageBtn} title="이미지 전송">
          📷
          <input
            ref={fileRef}
            className={styles.imageInput}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <textarea
          ref={textRef}
          className={styles.textInput}
          placeholder="메시지 보내기..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={1000}
        />

        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={sending || (!text.trim() && !imageFile)}
          aria-label="전송"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
