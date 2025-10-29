import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Image, ImagePlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { updateFileContent } from '../../features/files/fileSlice';
import { addImages } from '../../features/images/imageSlice';
import { fileToBase64 } from '../../utils/imageHelpers';
import MarkdownPreview from './MarkdownPreview';
import ImagePicker from '../ImageLibrary/ImagePicker';

/**
 * Éditeur Markdown avec support d'images et prévisualisation côte à côte
 * @param {Object} file - Fichier en cours d'édition
 */
export default function MarkdownEditor({ file }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState(file.content || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Mettre à jour le contenu local quand on change de fichier
  useEffect(() => {
    setContent(file.content || '');
  }, [file.id, file.content]);

  // Sauvegarder le contenu dans Redux
  const handleContentChange = (newContent) => {
    setContent(newContent);
    dispatch(updateFileContent({ id: file.id, content: newContent }));
  };

  // Gérer l'upload d'image
  const handleImageUpload = async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    // Vérifier que c'est bien une image
    if (!uploadedFile.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Limite de taille (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (uploadedFile.size > maxSize) {
      alert('L\'image est trop grande. La taille maximale est de 5 MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Convertir en base64
      const base64Data = await fileToBase64(uploadedFile);
      const imageId = uuidv4();
      const imageData = {
        id: imageId,
        name: uploadedFile.name,
        data: base64Data,
        size: uploadedFile.size,
        type: uploadedFile.type,
      };

      // Ajouter l'image à la bibliothèque via Redux
      dispatch(addImages(imageData));

      // Insérer la syntaxe Markdown à la position du curseur
      insertImageIntoEditor(imageId, uploadedFile.name);

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      alert('Une erreur est survenue lors de l\'upload de l\'image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Insérer une image depuis la bibliothèque
  const handleSelectFromLibrary = (image) => {
    insertImageIntoEditor(image.id, image.name);
  };

  // Helper pour insérer l'image dans l'éditeur
  const insertImageIntoEditor = (imageId, imageName) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea?.selectionStart || content.length;
    const imageMarkdown = `![${imageName}](${imageId})`;

    const newContent =
      content.slice(0, cursorPos) +
      imageMarkdown +
      content.slice(cursorPos);

    handleContentChange(newContent);

    // Replacer le curseur après l'image insérée
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPos = cursorPos + imageMarkdown.length;
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700">{file.name}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton pour insérer depuis la bibliothèque */}
          <button
            onClick={() => setShowImagePicker(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Choisir depuis la bibliothèque"
          >
            <ImagePlus size={16} />
            Bibliothèque
          </button>

          {/* Bouton d'upload d'image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Uploader une nouvelle image"
          >
            <Image size={16} />
            {isUploading ? 'Upload...' : 'Upload'}
          </button>
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Vue côte à côte : Éditeur + Prévisualisation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Éditeur (gauche) */}
        <div className="flex-1 border-r border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Édition</h3>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 w-full px-4 py-3 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Écrivez votre contenu en Markdown..."
            />
          </div>
        </div>

        {/* Prévisualisation (droite) */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Aperçu</h3>
            </div>
            <MarkdownPreview content={content} />
          </div>
        </div>
      </div>

      {/* Modal de sélection d'image */}
      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleSelectFromLibrary}
      />
    </div>
  );
}
