import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../../store/slices/postsSlice';
import subredditsReducer from '../../store/slices/subredditsSlice';
import commentsReducer from '../../store/slices/commentsSlice';
import SearchBar from './SearchBar';

const createMockStore = () =>
  configureStore({
    reducer: {
      posts: postsReducer,
      subreddits: subredditsReducer,
      comments: commentsReducer,
    },
  });

const renderWithStore = (component) => {
  const store = createMockStore();
  return { store, ...render(<Provider store={store}>{component}</Provider>) };
};

describe('SearchBar', () => {
  test('renders search input', () => {
    renderWithStore(<SearchBar />);
    expect(screen.getByPlaceholderText('Search Reddit...')).toBeInTheDocument();
  });

  test('renders search button', () => {
    renderWithStore(<SearchBar />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    renderWithStore(<SearchBar />);
    const input = screen.getByPlaceholderText('Search Reddit...');
    fireEvent.change(input, { target: { value: 'react hooks' } });
    expect(input.value).toBe('react hooks');
  });

  test('shows clear button when input has value', () => {
    renderWithStore(<SearchBar />);
    const input = screen.getByPlaceholderText('Search Reddit...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  test('clears input when clear button is clicked', () => {
    renderWithStore(<SearchBar />);
    const input = screen.getByPlaceholderText('Search Reddit...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(input.value).toBe('');
  });

  test('has search role for accessibility', () => {
    renderWithStore(<SearchBar />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });
});
