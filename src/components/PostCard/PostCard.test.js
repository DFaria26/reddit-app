import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './PostCard';

const mockPost = {
  id: 'abc123',
  title: 'Test Post Title',
  author: 'testuser',
  subreddit: 'reactjs',
  score: 1500,
  num_comments: 42,
  created_utc: Date.now() / 1000 - 3600,
  permalink: '/r/reactjs/comments/abc123/test_post/',
  thumbnail: '',
  link_flair_text: 'Discussion',
  link_flair_background_color: '#0079d3',
  link_flair_text_color: 'light',
};

describe('PostCard', () => {
  test('renders post title', () => {
    render(<PostCard post={mockPost} onSelect={() => {}} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  test('renders subreddit name', () => {
    render(<PostCard post={mockPost} onSelect={() => {}} />);
    expect(screen.getByText('r/reactjs')).toBeInTheDocument();
  });

  test('renders author name', () => {
    render(<PostCard post={mockPost} onSelect={() => {}} />);
    expect(screen.getByText('u/testuser')).toBeInTheDocument();
  });

  test('formats score as 1.5k', () => {
    render(<PostCard post={mockPost} onSelect={() => {}} />);
    expect(screen.getByText('1.5k')).toBeInTheDocument();
  });

  test('renders comment count', () => {
    render(<PostCard post={mockPost} onSelect={() => {}} />);
    expect(screen.getByText('42 Comments')).toBeInTheDocument();
  });

  test('renders flair when present', () => {
    render(<PostCard post={mockPost} onSelect={() => {}} />);
    expect(screen.getByText('Discussion')).toBeInTheDocument();
  });

  test('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<PostCard post={mockPost} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Test Post Title'));
    expect(onSelect).toHaveBeenCalledWith(mockPost);
  });

  test('calls onSelect on Enter key', () => {
    const onSelect = jest.fn();
    render(<PostCard post={mockPost} onSelect={onSelect} />);
    fireEvent.keyDown(screen.getByText('Test Post Title').closest('article'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(mockPost);
  });
});
