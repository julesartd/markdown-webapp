import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ImagePlus } from 'lucide-react';
import { updateFileContent } from '../../features/files/fileSlice';
import MarkdownPreview from './MarkdownPreview';
import ImagePicker from '../ImageLibrary/ImagePicker';

/**
 * Éditeur Markdown avec support d'images et prévisualisation côte à côte
 * @param {Object} file - Fichier en cours d'édition
 */
export default function MarkdownEditor({ file }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState(file.content || '');
  const [showImagePicker, setShowImagePicker] = useState(false);
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
      </div>

      {/* Vue côte à côte : Éditeur + Prévisualisation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Éditeur (gauche) */}
        <div className="flex-1 border-r border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Édition</h3>
              <button
                onClick={() => setShowImagePicker(true)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                title="Insérer une image"
              >
                <ImagePlus size={14} />
                Insérer image
              </button>
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
