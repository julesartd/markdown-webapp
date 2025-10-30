import { createSelector } from '@reduxjs/toolkit';

// Sélecteurs de base
export const selectImageLibrary = (state) => state.images.library;
export const selectSelectedImageIds = (state) => state.images.selectedImageIds;

// Sélecteur pour obtenir toutes les images sous forme de tableau
export const selectAllImages = createSelector([selectImageLibrary], (library) =>
  Object.values(library).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

// Sélecteur pour obtenir une image par ID
export const selectImageById = (imageId) =>
  createSelector([selectImageLibrary], (library) => library[imageId] || null);

// Sélecteur pour les images sélectionnées
export const selectSelectedImages = createSelector(
  [selectImageLibrary, selectSelectedImageIds],
  (library, selectedIds) => selectedIds.map((id) => library[id]).filter(Boolean)
);

// Sélecteur pour le nombre total d'images
export const selectImageCount = createSelector(
  [selectImageLibrary],
  (library) => Object.keys(library).length
);

// Sélecteur pour la taille totale des images (en bytes)
export const selectTotalImageSize = createSelector([selectAllImages], (images) =>
  images.reduce((total, img) => total + (img.size || 0), 0)
);

// Sélecteur pour filtrer les images par tags
export const selectImagesByTags = (tags) =>
  createSelector([selectAllImages], (images) => {
    if (!tags || tags.length === 0) return images;

    return images.filter((img) => tags.some((tag) => img.tags?.includes(tag)));
  });

// Sélecteur pour rechercher des images par nom
export const selectImagesByName = (searchQuery) =>
  createSelector([selectAllImages], (images) => {
    if (!searchQuery) return images;

    const query = searchQuery.toLowerCase();
    return images.filter((img) => img.name.toLowerCase().includes(query));
  });
