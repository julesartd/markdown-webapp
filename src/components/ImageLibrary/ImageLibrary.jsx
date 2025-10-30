import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Upload,
  Download,
  Trash2,
  Search,
  FolderOpen,
  CheckSquare,
  Square,
  ArrowLeft,
} from 'lucide-react';
import {
  addImages,
  renameImage,
  deleteImages,
  toggleSelection,
  selectAll,
  clearSelection,
  importImages,
} from '../../features/images/imageSlice';
import {
  selectAllImages,
  selectSelectedImageIds,
  selectImageCount,
  selectTotalImageSize,
} from '../../features/images/imageSelector';
import {
  convertFilesToImages,
  exportSingleImage,
  exportMultipleImages,
  importImageFile,
  formatFileSize,
} from '../../utils/imageHelpers';
import ImageDropzone from './ImageDropzone';
import ImageCard from './ImageCard';
import ConfirmModal from '../Modal/ConfirmModal';

/**
 * Bibliothèque d'images principale
 * @param {function} onClose - Callback pour fermer la bibliothèque
 */
export default function ImageLibrary({ onClose }) {
  const dispatch = useDispatch();
  const images = useSelector(selectAllImages);
  const selectedIds = useSelector(selectSelectedImageIds);
  const imageCount = useSelector(selectImageCount);
  const totalSize = useSelector(selectTotalImageSize);

  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const importInputRef = useRef(null);

  // Filtrer les images par recherche
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer l'ajout d'images depuis la dropzone
  const handleFilesSelected = async (files) => {
    try {
      const imageObjects = await convertFilesToImages(files);
      dispatch(addImages(imageObjects));
      toast.success(`${imageObjects.length} image(s) ajoutée(s) avec succès`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout des images:', error);
      toast.error('Une erreur est survenue lors de l\'ajout des images.');
    }
  };

  // Renommer une image
  const handleRename = (id, name) => {
    dispatch(renameImage({ id, name }));
    toast.success(`Image renommée en "${name}"`);
  };

  // Supprimer une image
  const handleDelete = (id) => {
    dispatch(deleteImages(id));
    toast.success('Image supprimée');
  };

  // Supprimer les images sélectionnées
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteSelected = () => {
    const count = selectedIds.length;
    dispatch(deleteImages(selectedIds));
    dispatch(clearSelection());
    toast.success(`${count} image(s) supprimée(s)`);
  };

  // Exporter une image
  const handleExport = (image) => {
    exportSingleImage(image);
    toast.success(`Image "${image.name}" exportée`);
  };

  // Exporter les images sélectionnées
  const handleExportSelected = () => {
    if (selectedIds.length === 0) return;

    const selectedImages = images.filter((img) => selectedIds.includes(img.id));
    exportMultipleImages(selectedImages, 'bibliotheque');
    toast.success(`${selectedIds.length} image(s) exportée(s)`);
  };

  // Importer des images depuis fichier .mdlc
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedImages = await importImageFile(file);
      dispatch(importImages(importedImages));
      toast.success(`${importedImages.length} image(s) importée(s) avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error(`Erreur lors de l'import : ${error.message}`);
    }

    // Reset input
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  // Toggle sélection globale
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAll());
    }
  };

  const allSelected = filteredImages.length > 0 && selectedIds.length === filteredImages.length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft size={16} />
                Retour
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bibliothèque d'images</h1>
              <p className="text-sm text-gray-500 mt-1">
                {imageCount} image{imageCount > 1 ? 's' : ''} • {formatFileSize(totalSize)}
              </p>
            </div>
          </div>

          {/* Actions globales */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => importInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen size={16} />
              Importer
            </button>

            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={handleExportSelected}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download size={16} />
                  Exporter ({selectedIds.length})
                </button>

                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Supprimer ({selectedIds.length})
                </button>
              </>
            )}
          </div>

          {/* Input file caché pour import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".mdlc"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Barre de recherche et sélection */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher une image..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {images.length > 0 && (
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
              {allSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {images.length === 0 ? (
          // Zone de dropzone quand vide
          <div className="max-w-2xl mx-auto">
            <ImageDropzone onFilesSelected={handleFilesSelected} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Dropzone compacte */}
            <div className="max-w-2xl mx-auto">
              <ImageDropzone onFilesSelected={handleFilesSelected} />
            </div>

            {/* Grille d'images */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    isSelected={selectedIds.includes(image.id)}
                    onToggleSelect={(id) => dispatch(toggleSelection(id))}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onExport={handleExport}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Aucune image ne correspond à votre recherche.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation pour suppression multiple */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteSelected}
        title="Supprimer les images sélectionnées"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} image(s) ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
