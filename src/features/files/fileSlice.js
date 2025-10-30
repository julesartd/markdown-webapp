import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  STORAGE_KEYS,
} from '../../utils/localStorage';

const initialState = loadFromLocalStorage(STORAGE_KEYS.FILES, {
  items: [],
  currentFileId: null,
  currentFolderId: null,
});

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
      saveToLocalStorage(STORAGE_KEYS.FILES, state);
    },

    addFolder: (state, action) => {
      state.items.push({
        id: uuidv4(),
        type: 'folder',
        name: action.payload.name || 'nouveau-dossier',
        parentId: action.payload.parentId || null,
        createdAt: new Date().toISOString(),
      });
      saveToLocalStorage(STORAGE_KEYS.FILES, state);
    },

    removeItem: (state, action) => {
      const removeRecursive = (id) => {
        const children = state.items.filter((item) => item.parentId === id);
        children.forEach((child) => removeRecursive(child.id));
        state.items = state.items.filter((item) => item.id !== id);
      };
      removeRecursive(action.payload);

      if (state.currentFileId === action.payload) {
        state.currentFileId = null;
      }
      if (state.currentFolderId === action.payload) {
        state.currentFolderId = null;
      }
      saveToLocalStorage(STORAGE_KEYS.FILES, state);
    },

    updateFileContent: (state, action) => {
      const file = state.items.find(
        (item) => item.id === action.payload.id && item.type === 'file'
      );
      if (file) {
        file.content = action.payload.content;
        saveToLocalStorage(STORAGE_KEYS.FILES, state);
      }
    },

    renameItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.name = action.payload.name;
        saveToLocalStorage(STORAGE_KEYS.FILES, state);
      }
    },

    moveItem: (state, action) => {
      const { itemId, newParentId } = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (!item) return;

      // Vérifier qu'on ne déplace pas un dossier dans lui-même ou ses enfants
      if (item.type === 'folder') {
        let checkParent = newParentId;
        while (checkParent) {
          if (checkParent === itemId) return;
          const parentItem = state.items.find((i) => i.id === checkParent);
          checkParent = parentItem?.parentId;
        }
      }

      item.parentId = newParentId || null;

      saveToLocalStorage(STORAGE_KEYS.FILES, state);
    },

    setCurrentFile: (state, action) => {
      const file = state.items.find(
        (item) => item.id === action.payload && item.type === 'file'
      );
      if (file) {
        state.currentFileId = action.payload;
        saveToLocalStorage(STORAGE_KEYS.FILES, state);
      }
    },

    setCurrentFolder: (state, action) => {
      if (action.payload === null) {
        state.currentFolderId = null;
        saveToLocalStorage(STORAGE_KEYS.FILES, state);
      } else {
        const folder = state.items.find(
          (item) => item.id === action.payload && item.type === 'folder'
        );
        if (folder) {
          state.currentFolderId = action.payload;
          saveToLocalStorage(STORAGE_KEYS.FILES, state);
        }
      }
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
  clearCurrentFolder,
} = fileSlice.actions;

export default fileSlice.reducer;
