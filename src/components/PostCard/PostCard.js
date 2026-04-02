import React from 'react';
import './PostCard.css';

const PostCard = ({ post, onSelect }) => {
  const getTimeSince = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  };

  const getThumbnail = () => {
    if (post.thumbnail && post.thumbnail.startsWith('http') && post.thumbnail !== 'default' && post.thumbnail !== 'self' && post.thumbnail !== 'nsfw' && post.thumbnail !== 'spoiler') {
      return post.thumbnail;
    }
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    return null;
  };

  const thumbnail = getThumbnail();

  return (
    <article className="post-card" onClick={() => onSelect(post)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSelect(post)}>
      <div className="post-card__votes">
        <button className="post-card__vote-btn" aria-label="Upvote" onClick={(e) => e.stopPropagation()}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
        <span className="post-card__score">{formatNumber(post.score)}</span>
        <button className="post-card__vote-btn" aria-label="Downvote" onClick={(e) => e.stopPropagation()}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      <div className="post-card__content">
        <div className="post-card__meta">
          <span className="post-card__subreddit">r/{post.subreddit}</span>
          <span className="post-card__separator">&bull;</span>
          <span className="post-card__author">u/{post.author}</span>
          <span className="post-card__separator">&bull;</span>
          <span className="post-card__time">{getTimeSince(post.created_utc)}</span>
        </div>

        <h3 className="post-card__title">{post.title}</h3>

        {post.link_flair_text && (
          <span className="post-card__flair" style={{
            backgroundColor: post.link_flair_background_color || '#edeff1',
            color: post.link_flair_text_color === 'light' ? '#fff' : '#1a1a1b'
          }}>
            {post.link_flair_text}
          </span>
        )}

        {thumbnail && (
          <div className="post-card__thumbnail-wrapper">
            <img
              src={thumbnail}
              alt=""
              className="post-card__thumbnail"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="post-card__actions">
          <span className="post-card__action">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {post.num_comments} Comments
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
