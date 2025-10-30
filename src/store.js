import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './features/files/fileSlice';
import imageReducer from './features/images/imageSlice';
import blocksReducer from './features/blocks/blocksSlice.js';

const store = configureStore({
  reducer: {
    files: fileReducer,
    images: imageReducer,
    blocks: blocksReducer
  },
});

export default store;
