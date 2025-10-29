/**
 * Helpers pour la gestion des images : conversion, import/export, validation
 */

// Convertir un fichier en base64 (déjà dans localStorage.js, mais on crée une version spécifique images)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Valider qu'un fichier est une image
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return file && validTypes.includes(file.type);
};

// Valider la taille du fichier (max en MB)
export const isValidImageSize = (file, maxSizeMB = 5) => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file && file.size <= maxBytes;
};

// Convertir des fichiers en objets image pour Redux
export const convertFilesToImages = async (files) => {
  const fileArray = Array.from(files);
  const validFiles = fileArray.filter((file) => isValidImageFile(file) && isValidImageSize(file));

  const imagePromises = validFiles.map(async (file) => {
    const base64 = await fileToBase64(file);

    return {
      name: file.name,
      data: base64,
      size: file.size,
      type: file.type,
      createdAt: new Date().toISOString(),
    };
  });

  return Promise.all(imagePromises);
};

// Exporter une image unique en fichier .img.mdlc
export const exportSingleImage = (image) => {
  const data = {
    version: '1.0',
    type: 'single',
    image: {
      id: image.id,
      name: image.name,
      data: image.data,
      size: image.size,
      type: image.type,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
      tags: image.tags || [],
    },
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Nom du fichier basé sur le nom de l'image
  const fileName = `${sanitizeFileName(image.name)}.img.mdlc`;

  downloadFile(url, fileName);
  URL.revokeObjectURL(url);
};

// Exporter plusieurs images en fichier .imgs.mdlc
export const exportMultipleImages = (images, libraryName = 'images') => {
  const data = {
    version: '1.0',
    type: 'multiple',
    exportedAt: new Date().toISOString(),
    count: images.length,
    images: images.map((img) => ({
      id: img.id,
      name: img.name,
      data: img.data,
      size: img.size,
      type: img.type,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
      tags: img.tags || [],
    })),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const fileName = `${sanitizeFileName(libraryName)}.imgs.mdlc`;

  downloadFile(url, fileName);
  URL.revokeObjectURL(url);
};

// Importer un fichier .img.mdlc ou .imgs.mdlc
export const importImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Vérifier le format
        if (!data.version || !data.type) {
          throw new Error('Format de fichier invalide');
        }

        // Vérifier l'extension
        const ext = file.name.split('.').pop();
        if (ext !== 'mdlc') {
          throw new Error('Extension de fichier invalide. Attendu : .img.mdlc ou .imgs.mdlc');
        }

        if (data.type === 'single') {
          // Fichier .img.mdlc
          if (!data.image) {
            throw new Error('Image manquante dans le fichier');
          }
          resolve([data.image]); // Retourner un tableau pour uniformiser
        } else if (data.type === 'multiple') {
          // Fichier .imgs.mdlc
          if (!Array.isArray(data.images)) {
            throw new Error('Liste d\'images manquante dans le fichier');
          }
          resolve(data.images);
        } else {
          throw new Error('Type de fichier non reconnu');
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsText(file);
  });
};

// Helper pour télécharger un fichier
const downloadFile = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Nettoyer un nom de fichier (retirer caractères spéciaux)
const sanitizeFileName = (name) => {
  // Retirer l'extension si présente
  const nameWithoutExt = name.replace(/\.[^/.]+$/, '');

  // Remplacer les caractères spéciaux par des tirets
  return nameWithoutExt
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

// Formater la taille en bytes vers format lisible
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Obtenir les dimensions d'une image base64
export const getImageDimensions = (base64) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = base64;
  });
};

// Vérifier si une image est utilisée dans des fichiers markdown
export const isImageUsedInFiles = (imageId, files) => {
  return files.some((file) => {
    if (file.type !== 'file' || !file.content) return false;
    return file.content.includes(imageId);
  });
};

// Obtenir la liste des fichiers utilisant une image
export const getFilesUsingImage = (imageId, files) => {
  return files.filter((file) => {
    if (file.type !== 'file' || !file.content) return false;
    return file.content.includes(imageId);
  });
};
