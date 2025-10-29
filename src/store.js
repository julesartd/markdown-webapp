import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './features/files/fileSlice';
import blocksReducer from './blocks/blocksSlice';

const store = configureStore({
  reducer: {
    files: fileReducer,
    blocks: blocksReducer
  },
});

export default store;
