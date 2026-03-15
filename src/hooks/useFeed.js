import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const FEED_KEY = 'mock_posts';

const INITIAL_POSTS = [
  {
    id: 'post1',
    authorId: 'user2',
    authorName: '상대방',
    caption: '오늘 날씨가 너무 좋다 ☀️ 산책하고 싶어',
    mediaUrl: null,
    mediaType: null,
    likes: ['user1'],
    comments: [
      {
        authorId: 'user1',
        authorName: '나',
        text: '나도 가고 싶어! 같이 가자 😊',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'post2',
    authorId: 'user1',
    authorName: '나',
    caption: '같이 보고 싶은 영화 생겼어 🎬 오늘 저녁에 볼까?',
    mediaUrl: null,
    mediaType: null,
    likes: ['user2'],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function loadPosts() {
  const stored = localStorage.getItem(FEED_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(FEED_KEY, JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
}

function savePosts(posts) {
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}

export function useFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(loadPosts());
    setLoading(false);
  }, []);

  async function createPost({ caption, file }) {
    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      mediaUrl = URL.createObjectURL(file);
      mediaType = file.type.startsWith('video') ? 'video' : 'image';
    }

    const newPost = {
      id: `post_${Date.now()}`,
      authorId: user.uid,
      authorName: user.displayName,
      caption,
      mediaUrl,
      mediaType,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => {
      const updated = [newPost, ...prev];
      savePosts(updated);
      return updated;
    });
  }

  async function toggleLike(postId, liked) {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        const likes = liked
          ? p.likes.filter((id) => id !== user.uid)
          : [...p.likes, user.uid];
        return { ...p, likes };
      });
      savePosts(updated);
      return updated;
    });
  }

  async function addComment(postId, text) {
    const comment = {
      authorId: user.uid,
      authorName: user.displayName,
      text,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, comments: [...(p.comments || []), comment] };
      });
      savePosts(updated);
      return updated;
    });
  }

  async function deletePost(postId) {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      savePosts(updated);
      return updated;
    });
  }

  return { posts, loading, createPost, toggleLike, addComment, deletePost };
}
