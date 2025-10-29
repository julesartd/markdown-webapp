import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [],
  currentFileId: null,
  currentFolderId: null,
};

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.items.push({
        id: uuidv4(),
        type: 'file',
        name: action.payload.name || 'nouveau.md',
        content: action.payload.content || '',
        parentId: action.payload.parentId || null,
        createdAt: new Date().toISOString(),
      });
    },

    addFolder: (state, action) => {
      state.items.push({
        id: uuidv4(),
        type: 'folder',
        name: action.payload.name || 'nouveau-dossier',
        parentId: action.payload.parentId || null,
        createdAt: new Date().toISOString(),
      });
    },

    removeItem: (state, action) => {
      const removeRecursive = (id) => {
        const children = state.items.filter((item) => item.parentId === id);
        children.forEach((child) => removeRecursive(child.id));
        state.items = state.items.filter((item) => item.id !== id);
      };
      removeRecursive(action.payload);
    },

    updateFileContent: (state, action) => {
      const file = state.items.find(
        (item) => item.id === action.payload.id && item.type === 'file'
      );
      if (file) file.content = action.payload.content;
    },

    renameItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.name = action.payload.name;
    },

    moveItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.parentId = action.payload.newParentId;
    },

    setCurrentFile: (state, action) => {
      state.currentFileId = action.payload;
    },

    setCurrentFolder: (state, action) => {
      state.currentFolderId = action.payload;
    },
  },
});

export const {
  addFile,
  addFolder,
  removeItem,
  updateFileContent,
  renameItem,
  moveItem,
  setCurrentFile,
  setCurrentFolder,
} = fileSlice.actions;

export default fileSlice.reducer;
