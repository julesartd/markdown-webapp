import { createSelector } from '@reduxjs/toolkit';

// Sélecteurs de base
export const selectAllItems = (state) => state.files.items;

export const selectCurrentFileId = (state) => state.files.currentFileId;

export const selectCurrentFolderId = (state) => state.files.currentFolderId;

export const selectFiles = (state) =>
  state.files.items.filter((item) => item.type === 'file');

export const selectFolders = (state) =>
  state.files.items.filter((item) => item.type === 'folder');

const sortItems = (items) => {
  return [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
  });
};

export const selectItemsByParent = createSelector(
  [selectAllItems, (state, parentId) => parentId],
  (items, parentId) => {
    const filteredItems = items.filter((item) => item.parentId === parentId);
    return sortItems(filteredItems);
  }
);

export const selectCurrentFile = createSelector(
  [selectAllItems, selectCurrentFileId],
  (items, currentFileId) =>
    items.find((item) => item.id === currentFileId && item.type === 'file')
);

export const selectCurrentFolder = createSelector(
  [selectAllItems, selectCurrentFolderId],
  (items, currentFolderId) =>
    items.find((item) => item.id === currentFolderId && item.type === 'folder')
);
