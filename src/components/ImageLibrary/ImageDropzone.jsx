import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

/**
 * Zone de drop pour importer des images (drag & drop + bouton parcourir)
 * @param {function} onFilesSelected - Callback avec les fichiers sélectionnés
 * @param {boolean} multiple - Autoriser plusieurs fichiers
 */
export default function ImageDropzone({ onFilesSelected, multiple = true }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Veuillez sélectionner des fichiers image valides.');
      return;
    }

    if (imageFiles.length < files.length) {
      alert(
        `${files.length - imageFiles.length} fichier(s) ignoré(s) (format non supporté).`
      );
    }

    onFilesSelected(imageFiles);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div
          className={`p-4 rounded-full ${
            isDragging ? 'bg-blue-100' : 'bg-gray-200'
          }`}
        >
          {isDragging ? (
            <Upload
              size={32}
              className="text-blue-600 animate-bounce"
            />
          ) : (
            <ImageIcon size={32} className="text-gray-500" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging
              ? 'Déposez vos images ici'
              : 'Glissez-déposez vos images ici'}
          </p>
          <p className="text-xs text-gray-500">ou</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Parcourir les fichiers
        </button>

        <p className="text-xs text-gray-400">
          Formats supportés : JPEG, PNG, GIF, WebP, SVG (max 5 MB par image)
        </p>
      </div>
    </div>
  );
}
