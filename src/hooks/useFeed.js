import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useFeed() {
  const { user, coupleId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId) return;
    const q = query(
      collection(db, 'couples', coupleId, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [coupleId]);

  async function uploadMedia(file) {
    const ext = file.name.split('.').pop();
    const path = `couples/${coupleId}/posts/${Date.now()}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async function createPost({ caption, file }) {
    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      mediaUrl = await uploadMedia(file);
      mediaType = file.type.startsWith('video') ? 'video' : 'image';
    }

    await addDoc(collection(db, 'couples', coupleId, 'posts'), {
      authorId: user.uid,
      authorName: user.displayName,
      caption,
      mediaUrl,
      mediaType,
      likes: [],
      createdAt: serverTimestamp(),
    });
  }

  async function toggleLike(postId, liked) {
    const ref = doc(db, 'couples', coupleId, 'posts', postId);
    await updateDoc(ref, {
      likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  }

  async function addComment(postId, text) {
    const comment = {
      authorId: user.uid,
      authorName: user.displayName,
      text,
      createdAt: new Date().toISOString(),
    };
    const ref = doc(db, 'couples', coupleId, 'posts', postId);
    await updateDoc(ref, {
      comments: arrayUnion(comment),
    });
  }

  async function deletePost(postId) {
    await deleteDoc(doc(db, 'couples', coupleId, 'posts', postId));
  }

  return { posts, loading, createPost, toggleLike, addComment, deletePost };
}
