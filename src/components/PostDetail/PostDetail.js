import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchComments, clearComments, selectComments, selectCommentsLoading, selectCommentsError } from '../../store/slices/commentsSlice';
import './PostDetail.css';

const PostDetail = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectCommentsLoading);
  const commentsError = useSelector(selectCommentsError);

  useEffect(() => {
    if (post?.permalink) {
      dispatch(fetchComments(post.permalink));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, post?.permalink]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getTimeSince = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  };

  const getImageUrl = () => {
    if (post.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(post.url)) {
      return post.url;
    }
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    return null;
  };

  const imageUrl = getImageUrl();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="post-detail__overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={post.title}>
      <div className="post-detail">
        <button className="post-detail__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="post-detail__header">
          <div className="post-detail__meta">
            <span className="post-detail__subreddit">r/{post.subreddit}</span>
            <span className="post-detail__separator">&bull;</span>
            <span>u/{post.author}</span>
            <span className="post-detail__separator">&bull;</span>
            <span>{getTimeSince(post.created_utc)}</span>
          </div>
          <h2 className="post-detail__title">{post.title}</h2>
          {post.link_flair_text && (
            <span className="post-detail__flair" style={{
              backgroundColor: post.link_flair_background_color || '#edeff1',
              color: post.link_flair_text_color === 'light' ? '#fff' : '#1a1a1b'
            }}>
              {post.link_flair_text}
            </span>
          )}
        </div>

        {imageUrl && (
          <div className="post-detail__image-wrapper">
            <img src={imageUrl} alt={post.title} className="post-detail__image" loading="lazy" />
          </div>
        )}

        {post.selftext && (
          <div className="post-detail__body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.selftext}</ReactMarkdown>
          </div>
        )}

        {post.url && !imageUrl && !post.is_self && (
          <a href={post.url} className="post-detail__link" target="_blank" rel="noopener noreferrer">
            {post.url}
          </a>
        )}

        <div className="post-detail__stats">
          <span className="post-detail__stat">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            {formatNumber(post.score)}
          </span>
          <span className="post-detail__stat">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {post.num_comments} Comments
          </span>
        </div>

        <div className="post-detail__comments">
          <h3 className="post-detail__comments-title">Comments</h3>

          {isLoading && (
            <div className="post-detail__comments-loading">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="post-detail__comment-skeleton">
                  <div className="post-detail__comment-skeleton-header" />
                  <div className="post-detail__comment-skeleton-body" />
                  <div className="post-detail__comment-skeleton-body post-detail__comment-skeleton-body--short" />
                </div>
              ))}
            </div>
          )}

          {commentsError && (
            <div className="post-detail__comments-error">
              <p>Failed to load comments: {commentsError}</p>
              <button className="post-detail__retry-btn" onClick={() => dispatch(fetchComments(post.permalink))}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !commentsError && comments.length === 0 && (
            <p className="post-detail__no-comments">No comments yet.</p>
          )}

          {!isLoading && !commentsError && comments.map((comment) => (
            comment.body && (
              <div key={comment.id} className="post-detail__comment">
                <div className="post-detail__comment-header">
                  <span className="post-detail__comment-author">u/{comment.author}</span>
                  <span className="post-detail__comment-separator">&bull;</span>
                  <span className="post-detail__comment-time">{getTimeSince(comment.created_utc)}</span>
                  <span className="post-detail__comment-separator">&bull;</span>
                  <span className="post-detail__comment-score">{formatNumber(comment.score)} pts</span>
                </div>
                <div className="post-detail__comment-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
