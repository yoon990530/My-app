// Mobile-only chat page (accessed via bottom tab on mobile)
import ChatPanel from '../components/Chat/ChatPanel';
import styles from './ChatPage.module.css';

export default function ChatPage() {
  return (
    <div className={styles.page}>
      <ChatPanel fullPage />
    </div>
  );
}
