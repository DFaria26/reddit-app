import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubredditPosts, searchPosts, getPopularPosts } from '../../api/reddit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit) => {
    return await getSubredditPosts(subreddit);
  }
);

export const fetchPopularPosts = createAsyncThunk(
  'posts/fetchPopularPosts',
  async () => {
    return await getPopularPosts();
  }
);

export const fetchSearchResults = createAsyncThunk(
  'posts/fetchSearchResults',
  async (searchTerm) => {
    return await searchPosts(searchTerm);
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    selectedSubreddit: 'popular',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPopularPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPopularPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPopularPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setSelectedSubreddit } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectError = (state) => state.posts.error;
export const selectSearchTerm = (state) => state.posts.searchTerm;
export const selectSelectedSubreddit = (state) => state.posts.selectedSubreddit;

export default postsSlice.reducer;
