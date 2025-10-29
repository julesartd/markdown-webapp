import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  STORAGE_KEYS,
} from '../../utils/localStorage';

/**
 * Structure d'une image dans la bibliothèque :
 * {
 *   id: string (UUID),
 *   name: string,
 *   data: string (base64),
 *   size: number (bytes),
 *   type: string (MIME type),
 *   createdAt: string (ISO date),
 *   updatedAt: string (ISO date),
 *   tags: string[] (pour filtrage futur)
 * }
 */

// État initial avec valeurs par défaut
const defaultState = {
  library: {}, // Object avec id comme clé pour accès O(1)
  selectedImageIds: [], // Pour sélection multiple
};

const initialState = loadFromLocalStorage(STORAGE_KEYS.IMAGES, defaultState) || defaultState;

export const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    // Ajouter une ou plusieurs images
    addImages: (state, action) => {
      const images = Array.isArray(action.payload) ? action.payload : [action.payload];

      images.forEach((image) => {
        const id = image.id || uuidv4();
        state.library[id] = {
          id,
          name: image.name,
          data: image.data,
          size: image.size,
          type: image.type,
          createdAt: image.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: image.tags || [],
        };
      });

      saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
    },

    // Renommer une image
    renameImage: (state, action) => {
      const { id, name } = action.payload;
      if (state.library[id]) {
        state.library[id].name = name;
        state.library[id].updatedAt = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
      }
    },

    // Supprimer une ou plusieurs images
    deleteImages: (state, action) => {
      const ids = Array.isArray(action.payload) ? action.payload : [action.payload];

      ids.forEach((id) => {
        delete state.library[id];
      });

      // Retirer des sélections
      state.selectedImageIds = state.selectedImageIds.filter((id) => !ids.includes(id));

      saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
    },

    // Ajouter des tags à une image
    addTags: (state, action) => {
      const { id, tags } = action.payload;
      if (state.library[id]) {
        const newTags = Array.isArray(tags) ? tags : [tags];
        state.library[id].tags = [...new Set([...state.library[id].tags, ...newTags])];
        state.library[id].updatedAt = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
      }
    },

    // Retirer des tags
    removeTags: (state, action) => {
      const { id, tags } = action.payload;
      if (state.library[id]) {
        const tagsToRemove = Array.isArray(tags) ? tags : [tags];
        state.library[id].tags = state.library[id].tags.filter(
          (tag) => !tagsToRemove.includes(tag)
        );
        state.library[id].updatedAt = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
      }
    },

    // Sélectionner/désélectionner des images (pour actions groupées)
    toggleSelection: (state, action) => {
      const id = action.payload;
      const index = state.selectedImageIds.indexOf(id);

      if (index > -1) {
        state.selectedImageIds.splice(index, 1);
      } else {
        state.selectedImageIds.push(id);
      }
    },

    // Sélectionner toutes les images
    selectAll: (state) => {
      state.selectedImageIds = Object.keys(state.library);
    },

    // Désélectionner toutes les images
    clearSelection: (state) => {
      state.selectedImageIds = [];
    },

    // Importer des images depuis un fichier .imgs.mdlc
    importImages: (state, action) => {
      const images = action.payload;

      if (Array.isArray(images)) {
        images.forEach((image) => {
          const id = image.id || uuidv4();
          state.library[id] = {
            ...image,
            id,
            updatedAt: new Date().toISOString(),
          };
        });
      } else if (typeof images === 'object') {
        const id = images.id || uuidv4();
        state.library[id] = {
          ...images,
          id,
          updatedAt: new Date().toISOString(),
        };
      }

      saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
    },

    // Nettoyer toutes les images
    clearLibrary: (state) => {
      state.library = {};
      state.selectedImageIds = [];
      saveToLocalStorage(STORAGE_KEYS.IMAGES, state);
    },
  },
});

export const {
  addImages,
  renameImage,
  deleteImages,
  addTags,
  removeTags,
  toggleSelection,
  selectAll,
  clearSelection,
  importImages,
  clearLibrary,
} = imageSlice.actions;

export default imageSlice.reducer;
