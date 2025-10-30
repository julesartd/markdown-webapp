import { createSelector } from '@reduxjs/toolkit';

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

// Fonction utilitaire pour construire le chemin complet d'un fichier
const buildFilePath = (items, file) => {
  if (!file) return '';

  const pathParts = [file.name];
  let currentItem = file;

  // Remonter la hiérarchie en suivant les parentId
  while (currentItem.parentId) {
    const parent = items.find((item) => item.id === currentItem.parentId);
    if (!parent) break;
    pathParts.unshift(parent.name);
    currentItem = parent;
  }

  return pathParts.join('/');
};

// Selector pour obtenir le chemin complet du fichier actuel
export const selectCurrentFilePath = createSelector(
  [selectAllItems, selectCurrentFile],
  (items, currentFile) => buildFilePath(items, currentFile)
);
