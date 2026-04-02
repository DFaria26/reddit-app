import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import PostList from './components/PostList/PostList';
import PostDetail from './components/PostDetail/PostDetail';
import { fetchPopularPosts } from './store/slices/postsSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPopularPosts());
  }, [dispatch]);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  return (
    <div className="app">
      <Header />
      <div className="app__layout">
        <button
          className="app__sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle subreddits menu"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          Subreddits
        </button>
        <aside className={`app__sidebar ${sidebarOpen ? 'app__sidebar--open' : ''}`}>
          <Sidebar />
        </aside>
        {sidebarOpen && (
          <div className="app__sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="app__main">
          <PostList onSelectPost={handleSelectPost} />
        </main>
      </div>
      {selectedPost && (
        <PostDetail post={selectedPost} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;
