import postsReducer, { setSearchTerm, setSelectedSubreddit } from './postsSlice';

describe('postsSlice', () => {
  const initialState = {
    posts: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    selectedSubreddit: 'popular',
  };

  test('returns the initial state', () => {
    expect(postsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('handles setSearchTerm', () => {
    const state = postsReducer(initialState, setSearchTerm('react hooks'));
    expect(state.searchTerm).toBe('react hooks');
  });

  test('handles setSelectedSubreddit', () => {
    const state = postsReducer(initialState, setSelectedSubreddit('javascript'));
    expect(state.selectedSubreddit).toBe('javascript');
    expect(state.searchTerm).toBe('');
  });

  test('setSelectedSubreddit clears search term', () => {
    const stateWithSearch = { ...initialState, searchTerm: 'test' };
    const state = postsReducer(stateWithSearch, setSelectedSubreddit('react'));
    expect(state.searchTerm).toBe('');
  });
});
