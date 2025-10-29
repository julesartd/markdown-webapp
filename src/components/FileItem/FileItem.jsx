import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreVertical } from 'lucide-react';
import {
  removeItem,
  renameItem,
  setCurrentFile,
  setCurrentFolder,
  addFile,
  addFolder,
} from '../../features/files/fileSlice';
import { selectCurrentFolderId } from '../../features/files/fileSelector';
import FileItemIcon from './FileItemIcon';
import FileItemName from './FileItemName';
import FileItemMenu from './FileItemMenu';
import FileItemToggle from './FileItemToggle';
import ConfirmModal from '../Modal/ConfirmModal';

function FileItem({ item, hasChildren, isExpanded, onToggleExpand }) {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const isActiveFolder = item.type === 'folder' && item.id === currentFolderId;

  const handleClick = () => {
    if (item.type === 'file') {
      dispatch(setCurrentFile(item.id));
    } else {
      dispatch(setCurrentFolder(item.id));
      if (hasChildren && !isExpanded && onToggleExpand) {
        onToggleExpand();
      }
    }
  };

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      setShowRenameModal(true);
    } else {
      setIsEditing(false);
    }
  };

  const confirmRename = () => {
    dispatch(renameItem({ id: item.id, name: newName.trim() }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    dispatch(removeItem(item.id));
  };

  const handleAddFile = () => {
    dispatch(addFile({ name: 'nouveau.md', parentId: item.id }));
    if (onToggleExpand && !isExpanded) {
      onToggleExpand();
    }
    setShowMenu(false);
  };

  const handleAddFolder = () => {
    dispatch(addFolder({ name: 'nouveau-dossier', parentId: item.id }));
    if (onToggleExpand && !isExpanded) {
      onToggleExpand();
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group ${
          isActiveFolder ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'
        }`}
      >
        <FileItemToggle
          item={item}
          isExpanded={isExpanded}
          onToggle={onToggleExpand}
          hasChildren={hasChildren}
        />

        <FileItemIcon
          item={item}
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onClick={handleClick}
        />

        <FileItemName
          item={item}
          isEditing={isEditing}
          newName={newName}
          isActiveFolder={isActiveFolder}
          onNameChange={setNewName}
          onRename={handleRename}
          onCancelEdit={() => setIsEditing(false)}
          onClick={handleClick}
        />

        <button
          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>

        <FileItemMenu
          item={item}
          showMenu={showMenu}
          hasChildren={hasChildren}
          onClose={() => setShowMenu(false)}
          onRename={() => {
            setIsEditing(true);
            setShowMenu(false);
          }}
          onDelete={handleDelete}
          onAddFile={handleAddFile}
          onAddFolder={handleAddFolder}
        />
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={
          hasChildren
            ? `Êtes-vous sûr de vouloir supprimer "${item.name}" et tout son contenu ? Cette action est irréversible.`
            : `Êtes-vous sûr de vouloir supprimer "${item.name}" ? Cette action est irréversible.`
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      {/* Modal de confirmation de renommage */}
      <ConfirmModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setNewName(item.name);
          setIsEditing(false);
        }}
        onConfirm={confirmRename}
        title="Confirmer le renommage"
        message={`Voulez-vous vraiment renommer "${item.name}" en "${newName}" ?`}
        confirmText="Renommer"
        cancelText="Annuler"
        variant="primary"
      />
    </div>
  );
}

export default FileItem;
