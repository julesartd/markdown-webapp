import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, X, Image as ImageIcon } from 'lucide-react';
import { selectAllImages } from '../../features/images/imageSelector';
import Modal from '../Modal/Modal';
import { formatFileSize } from '../../utils/imageHelpers';

/**
 * Modal pour choisir une image depuis la bibliothèque
 * @param {boolean} isOpen - État d'ouverture
 * @param {function} onClose - Callback de fermeture
 * @param {function} onSelect - Callback de sélection (image)
 */
export default function ImagePicker({ isOpen, onClose, onSelect }) {
  const images = useSelector(selectAllImages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Filtrer les images par recherche
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedImage(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Choisir une image" size="lg">
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
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

        {/* Liste d'images */}
        {images.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Aucune image dans la bibliothèque</p>
            <p className="text-sm text-gray-400">
              Ajoutez des images à votre bibliothèque pour les utiliser ici
            </p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune image ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage?.id === image.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={image.data}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-center px-2">
                    <p className="text-xs font-medium truncate mb-1">{image.name}</p>
                    <p className="text-xs">{formatFileSize(image.size)}</p>
                  </div>
                </div>

                {/* Indicateur de sélection */}
                {selectedImage?.id === image.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Informations sur l'image sélectionnée */}
        {selectedImage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900 mb-1">Image sélectionnée :</p>
            <p className="text-sm text-blue-700">{selectedImage.name}</p>
            <p className="text-xs text-blue-600 mt-1">
              {formatFileSize(selectedImage.size)} • {selectedImage.type.split('/')[1].toUpperCase()}
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedImage}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Insérer l'image
          </button>
        </div>
      </div>
    </Modal>
  );
}
