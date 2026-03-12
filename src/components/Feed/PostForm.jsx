import { useState, useRef } from 'react';
import { useFeed } from '../../hooks/useFeed';
import styles from './PostForm.module.css';

export default function PostForm() {
  const { createPost } = useFeed();
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!caption.trim() && !file) return;
    setLoading(true);
    try {
      await createPost({ caption: caption.trim(), file });
      setCaption('');
      removeFile();
    } finally {
      setLoading(false);
    }
  }

  const isVideo = file?.type?.startsWith('video');

  return (
    <div className={styles.card}>
      <p className={styles.header}>오늘 어땠어?</p>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="지금 이 순간을 기록해봐..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={500}
        />

        {preview && (
          isVideo ? (
            <video className={styles.preview} src={preview} controls muted />
          ) : (
            <img className={styles.preview} src={preview} alt="미리보기" />
          )
        )}

        <div className={styles.fileArea}>
          <label className={styles.fileLabel}>
            📷 사진/영상
            <input
              ref={fileRef}
              className={styles.fileInput}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <>
              <span className={styles.fileName}>{file.name}</span>
              <button type="button" className={styles.removeFile} onClick={removeFile}>
                제거
              </button>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading || (!caption.trim() && !file)}
          >
            {loading ? '올리는 중...' : '게시하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
