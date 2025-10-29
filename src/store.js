import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './features/files/fileSlice';
import imageReducer from './features/images/imageSlice';

const store = configureStore({
  reducer: {
    files: fileReducer,
    images: imageReducer,
  },
});

export default store;
