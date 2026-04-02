import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubreddits, selectSubreddits, selectSubredditsLoading } from '../../store/slices/subredditsSlice';
import { fetchPosts, setSelectedSubreddit, selectSelectedSubreddit } from '../../store/slices/postsSlice';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const subreddits = useSelector(selectSubreddits);
  const isLoading = useSelector(selectSubredditsLoading);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const handleSubredditClick = (subreddit) => {
    dispatch(setSelectedSubreddit(subreddit));
    dispatch(fetchPosts(subreddit));
  };

  const getIconUrl = (sub) => {
    if (sub.icon_img) return sub.icon_img;
    if (sub.community_icon) return sub.community_icon.split('?')[0];
    return null;
  };

  if (isLoading) {
    return (
      <aside className="sidebar" aria-label="Subreddits">
        <h2 className="sidebar__title">Subreddits</h2>
        <div className="sidebar__loading">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="sidebar__skeleton" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar" aria-label="Subreddits">
      <h2 className="sidebar__title">Subreddits</h2>
      <ul className="sidebar__list">
        <li>
          <button
            className={`sidebar__item ${selectedSubreddit === 'popular' ? 'sidebar__item--active' : ''}`}
            onClick={() => handleSubredditClick('popular')}
          >
            <span className="sidebar__item-icon sidebar__item-icon--default">&#127775;</span>
            <span className="sidebar__item-name">Popular</span>
          </button>
        </li>
        {subreddits.map((sub) => (
          <li key={sub.id}>
            <button
              className={`sidebar__item ${selectedSubreddit === sub.display_name ? 'sidebar__item--active' : ''}`}
              onClick={() => handleSubredditClick(sub.display_name)}
            >
              {getIconUrl(sub) ? (
                <img
                  src={getIconUrl(sub)}
                  alt=""
                  className="sidebar__item-icon"
                  loading="lazy"
                />
              ) : (
                <span className="sidebar__item-icon sidebar__item-icon--default">
                  {sub.display_name[0].toUpperCase()}
                </span>
              )}
              <span className="sidebar__item-name">r/{sub.display_name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
