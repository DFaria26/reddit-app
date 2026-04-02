import React from 'react';
import { useSelector } from 'react-redux';
import { selectPosts, selectIsLoading, selectError, selectSearchTerm, selectSelectedSubreddit } from '../../store/slices/postsSlice';
import PostCard from '../PostCard/PostCard';
import './PostList.css';

const PostList = ({ onSelectPost }) => {
  const posts = useSelector(selectPosts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const searchTerm = useSelector(selectSearchTerm);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);

  if (isLoading) {
    return (
      <div className="post-list">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="post-list__skeleton">
            <div className="post-list__skeleton-votes" />
            <div className="post-list__skeleton-content">
              <div className="post-list__skeleton-meta" />
              <div className="post-list__skeleton-title" />
              <div className="post-list__skeleton-title post-list__skeleton-title--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list__error" role="alert">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ff4500" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="post-list__retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-list__empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#878a8c" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>No posts found</h3>
        <p>Try a different search term or subreddit.</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list__header">
        {searchTerm ? (
          <h2 className="post-list__heading">Search results for "{searchTerm}"</h2>
        ) : (
          <h2 className="post-list__heading">r/{selectedSubreddit}</h2>
        )}
        <span className="post-list__count">{posts.length} posts</span>
      </div>
      {posts.map((post, index) => (
        <div key={post.id} style={{ animationDelay: `${index * 0.05}s` }}>
          <PostCard post={post} onSelect={onSelectPost} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
