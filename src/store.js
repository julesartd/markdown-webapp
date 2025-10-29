import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './features/files/fileSlice';

const store = configureStore({
  reducer: {
    files: fileReducer,
  },
});

export default store;
