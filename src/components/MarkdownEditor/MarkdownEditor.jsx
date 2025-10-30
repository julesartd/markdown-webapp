import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ImagePlus, FileUp, Download } from 'lucide-react';
import { updateFileContent } from '../../features/files/fileSlice';
import MarkdownPreview from './MarkdownPreview';
import ImagePicker from '../ImageLibrary/ImagePicker';

/**
 * Éditeur Markdown avec support d'images et prévisualisation côte à côte
 * @param {Object} file - Fichier en cours d'édition
 * @param {string} filePath - Chemin complet du fichier
 */
export default function MarkdownEditor({ file, filePath }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState(file.content || '');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const textareaRef = useRef(null);
  const importFileRef = useRef(null);

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

  // Importer un fichier .md
  const handleImportFile = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.md')) {
      alert('Veuillez sélectionner un fichier Markdown (.md)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      handleContentChange(fileContent);
    };
    reader.onerror = () => {
      alert('Erreur lors de la lecture du fichier');
    };
    reader.readAsText(uploadedFile);

    // Reset input
    if (importFileRef.current) {
      importFileRef.current.value = '';
    }
  };

  // Exporter le fichier en .md
  const handleExportFile = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700">{filePath || file.name}</h2>
        </div>
      </div>

      {/* Vue côte à côte : Éditeur + Prévisualisation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Éditeur (gauche) */}
        <div className="flex-1 border-r border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Édition</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => importFileRef.current?.click()}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  title="Importer un fichier .md"
                >
                  <FileUp size={14} />
                  Importer
                </button>
                <button
                  onClick={() => setShowImagePicker(true)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  title="Insérer une image"
                >
                  <ImagePlus size={14} />
                  Image
                </button>
              </div>
            </div>

            {/* Input file caché pour import */}
            <input
              ref={importFileRef}
              type="file"
              accept=".md"
              onChange={handleImportFile}
              className="hidden"
            />
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
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Aperçu</h3>
              <button
                onClick={handleExportFile}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                title="Exporter en fichier .md"
              >
                <Download size={14} />
                Exporter
              </button>
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
