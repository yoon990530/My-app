import { useFeed } from '../hooks/useFeed';
import PostCard from '../components/Feed/PostCard';
import PostForm from '../components/Feed/PostForm';
import ChatPanel from '../components/Chat/ChatPanel';
import styles from './Home.module.css';

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.skeletonMedia} skeleton`} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.short} skeleton`} />
        <div className={`${styles.skeletonLine} ${styles.medium} skeleton`} />
        <div className={`${styles.skeletonLine} skeleton`} />
      </div>
    </div>
  );
}

export default function Home() {
  const { posts, loading } = useFeed();

  return (
    <div className={styles.layout}>
      <main className={`${styles.feed} page-enter`}>
        <h1 className={styles.feedTitle}>홈 피드</h1>
        <PostForm />
        {loading ? (
          <div className={styles.postList}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📷</p>
            <p>첫 번째 게시물을 올려보세요!</p>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Chat panel — hidden on mobile via its own CSS */}
      <ChatPanel />
    </div>
  );
}
