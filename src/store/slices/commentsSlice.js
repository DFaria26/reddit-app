import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPostComments } from '../../api/reddit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (permalink) => {
    return await getPostComments(permalink);
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearComments } = commentsSlice.actions;

export const selectComments = (state) => state.comments.comments;
export const selectCommentsLoading = (state) => state.comments.isLoading;
export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
