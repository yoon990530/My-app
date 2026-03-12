import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFeed } from '../../hooks/useFeed';
import styles from './PostCard.module.css';

function formatTime(ts) {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

export default function PostCard({ post }) {
  const { user } = useAuth();
  const { toggleLike, addComment, deletePost } = useFeed();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liked = post.likes?.includes(user?.uid);
  const isOwner = post.authorId === user?.uid;
  const initial = post.authorName?.[0]?.toUpperCase() || '?';

  async function handleLike() {
    await toggleLike(post.id, liked);
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await addComment(post.id, commentText.trim());
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className={styles.card}>
      {post.mediaUrl && post.mediaType === 'video' ? (
        <video
          className={styles.video}
          src={post.mediaUrl}
          controls
          playsInline
          muted
        />
      ) : post.mediaUrl ? (
        <img className={styles.media} src={post.mediaUrl} alt="게시물 이미지" />
      ) : null}

      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.author}>
            <div className={styles.avatar}>{initial}</div>
            <span className={styles.authorName}>{post.authorName}</span>
          </div>
          <span className={styles.time}>{formatTime(post.createdAt)}</span>
        </div>

        {post.caption && <p className={styles.caption}>{post.caption}</p>}

        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
            onClick={handleLike}
            aria-label={liked ? '좋아요 취소' : '좋아요'}
          >
            <span className={styles.actionIcon}>{liked ? '❤️' : '🤍'}</span>
            {post.likes?.length || 0}
          </button>
          <button className={styles.actionBtn} aria-label="댓글">
            <span className={styles.actionIcon}>💬</span>
            {post.comments?.length || 0}
          </button>
          {isOwner && (
            <button
              className={styles.deleteBtn}
              onClick={() => deletePost(post.id)}
            >
              삭제
            </button>
          )}
        </div>

        {post.comments?.length > 0 && (
          <div className={styles.comments}>
            {post.comments.map((c, i) => (
              <div key={i} className={styles.comment}>
                <span className={styles.commentAuthor}>{c.authorName}</span>
                <span className={styles.commentText}>{c.text}</span>
              </div>
            ))}
          </div>
        )}

        <form className={styles.commentForm} onSubmit={handleComment}>
          <input
            className={styles.commentInput}
            type="text"
            placeholder="댓글 달기..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={200}
          />
          <button
            className={styles.commentSubmit}
            type="submit"
            disabled={submitting || !commentText.trim()}
            aria-label="댓글 전송"
          >
            ↑
          </button>
        </form>
      </div>
    </article>
  );
}
