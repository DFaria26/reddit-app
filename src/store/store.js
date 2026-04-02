import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import subredditsReducer from './slices/subredditsSlice';
import commentsReducer from './slices/commentsSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    subreddits: subredditsReducer,
    comments: commentsReducer,
  },
});

export default store;
