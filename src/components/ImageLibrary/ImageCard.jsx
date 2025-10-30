import { useState } from 'react';
import { Edit2, Trash2, Download, Check, X, FileText } from 'lucide-react';
import { formatFileSize } from '../../utils/imageHelpers';
import ConfirmModal from '../Modal/ConfirmModal';

/**
 * Carte d'affichage d'une image avec actions (preview, rename, delete, export)
 * @param {Object} image - Objet image
 * @param {boolean} isSelected - Image sélectionnée
 * @param {function} onToggleSelect - Toggle sélection
 * @param {function} onRename - Callback renommage
 * @param {function} onDelete - Callback suppression
 * @param {function} onExport - Callback export
 * @param {function} onClick - Callback clic sur l'image (pour insertion)
 */
export default function ImageCard({
  image,
  isSelected = false,
  onToggleSelect,
  onRename,
  onDelete,
  onExport,
  onClick,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(image.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRename = () => {
    if (newName.trim() && newName !== image.name) {
      onRename(image.id, newName.trim());
    }
    setIsEditing(false);
    setNewName(image.name);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName(image.name);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(image.id);
  };

  return (
    <div
      className={`group relative bg-white border rounded-lg overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
      }`}
    >
      {/* Checkbox de sélection */}
      {onToggleSelect && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(image.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      )}

      {/* Prévisualisation de l'image */}
      <div
        className={`aspect-square bg-gray-100 flex items-center justify-center overflow-hidden ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        <img
          src={image.data}
          alt={image.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Informations */}
      <div className="p-3 space-y-2">
        {/* Nom (éditable) */}
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleRename}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Confirmer"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Annuler"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <h3
            className="text-sm font-medium text-gray-900 truncate"
            title={image.name}
          >
            {image.name}
          </h3>
        )}

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(image.size)}</span>
          <span>{image.type.split('/')[1].toUpperCase()}</span>
        </div>

        {/* Tags (si présents) */}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {image.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{image.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            title="Renommer"
          >
            <Edit2 size={14} />
            Renommer
          </button>

          {onExport && (
            <button
              onClick={() => onExport(image)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Exporter"
            >
              <Download size={16} />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'image"
        message={`Êtes-vous sûr de vouloir supprimer l'image "${image.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
