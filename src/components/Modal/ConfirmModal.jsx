import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

/**
 * Modal de confirmation pour actions critiques
 * @param {boolean} isOpen - État d'ouverture
 * @param {function} onClose - Callback d'annulation
 * @param {function} onConfirm - Callback de confirmation
 * @param {string} title - Titre de la modal
 * @param {string} message - Message de confirmation
 * @param {string} confirmText - Texte du bouton de confirmation
 * @param {string} cancelText - Texte du bouton d'annulation
 * @param {string} variant - Style du bouton ('danger', 'warning', 'primary')
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    primary: 'text-blue-600',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`rounded-full bg-gray-100 p-3 ${iconColors[variant]}`}>
            <AlertTriangle size={32} />
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 text-sm leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
