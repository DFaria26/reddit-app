import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './store/slices/postsSlice';
import subredditsReducer from './store/slices/subredditsSlice';
import commentsReducer from './store/slices/commentsSlice';

jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);
jest.mock('remark-gfm', () => () => {});

import App from './App';

const createMockStore = (preloadedState) =>
  configureStore({
    reducer: {
      posts: postsReducer,
      subreddits: subredditsReducer,
      comments: commentsReducer,
    },
    preloadedState,
  });

const renderWithStore = (component, preloadedState) => {
  const store = createMockStore(preloadedState);
  return render(<Provider store={store}>{component}</Provider>);
};

describe('App', () => {
  test('renders the header with app title', () => {
    renderWithStore(<App />);
    expect(screen.getByText('Reddit')).toBeInTheDocument();
    expect(screen.getByText('Lite')).toBeInTheDocument();
  });

  test('renders search bar', () => {
    renderWithStore(<App />);
    expect(screen.getByPlaceholderText('Search Reddit...')).toBeInTheDocument();
  });

  test('renders subreddits sidebar title', () => {
    renderWithStore(<App />);
    expect(screen.getAllByText('Subreddits').length).toBeGreaterThanOrEqual(1);
  });
});
