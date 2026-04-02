import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../../store/slices/postsSlice';
import subredditsReducer from '../../store/slices/subredditsSlice';
import commentsReducer from '../../store/slices/commentsSlice';
import PostList from './PostList';

const createMockStore = (preloadedState) =>
  configureStore({
    reducer: {
      posts: postsReducer,
      subreddits: subredditsReducer,
      comments: commentsReducer,
    },
    preloadedState,
  });

describe('PostList', () => {
  test('shows loading skeletons when loading', () => {
    const store = createMockStore({
      posts: { posts: [], isLoading: true, error: null, searchTerm: '', selectedSubreddit: 'popular' },
      subreddits: { subreddits: [], isLoading: false, error: null },
      comments: { comments: [], isLoading: false, error: null },
    });
    const { container } = render(
      <Provider store={store}><PostList onSelectPost={() => {}} /></Provider>
    );
    expect(container.querySelectorAll('.post-list__skeleton').length).toBe(5);
  });

  test('shows error message when there is an error', () => {
    const store = createMockStore({
      posts: { posts: [], isLoading: false, error: 'Network error', searchTerm: '', selectedSubreddit: 'popular' },
      subreddits: { subreddits: [], isLoading: false, error: null },
      comments: { comments: [], isLoading: false, error: null },
    });
    render(
      <Provider store={store}><PostList onSelectPost={() => {}} /></Provider>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('shows empty state when no posts', () => {
    const store = createMockStore({
      posts: { posts: [], isLoading: false, error: null, searchTerm: '', selectedSubreddit: 'popular' },
      subreddits: { subreddits: [], isLoading: false, error: null },
      comments: { comments: [], isLoading: false, error: null },
    });
    render(
      <Provider store={store}><PostList onSelectPost={() => {}} /></Provider>
    );
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  test('renders posts when available', () => {
    const mockPosts = [
      {
        id: '1',
        title: 'First Post',
        author: 'user1',
        subreddit: 'test',
        score: 100,
        num_comments: 5,
        created_utc: Date.now() / 1000 - 3600,
        permalink: '/r/test/1/',
        thumbnail: '',
      },
    ];
    const store = createMockStore({
      posts: { posts: mockPosts, isLoading: false, error: null, searchTerm: '', selectedSubreddit: 'test' },
      subreddits: { subreddits: [], isLoading: false, error: null },
      comments: { comments: [], isLoading: false, error: null },
    });
    render(
      <Provider store={store}><PostList onSelectPost={() => {}} /></Provider>
    );
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getAllByText('r/test').length).toBeGreaterThanOrEqual(1);
  });

  test('shows search results heading when searchTerm is set', () => {
    const store = createMockStore({
      posts: { posts: [{ id: '1', title: 'Result', author: 'u', subreddit: 's', score: 1, num_comments: 0, created_utc: Date.now() / 1000, permalink: '/r/s/1/', thumbnail: '' }], isLoading: false, error: null, searchTerm: 'react', selectedSubreddit: 'popular' },
      subreddits: { subreddits: [], isLoading: false, error: null },
      comments: { comments: [], isLoading: false, error: null },
    });
    render(
      <Provider store={store}><PostList onSelectPost={() => {}} /></Provider>
    );
    expect(screen.getByText(/Search results for "react"/)).toBeInTheDocument();
  });
});
