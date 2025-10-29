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
import {
  selectCurrentFileId,
  selectCurrentFolderId,
} from '../../features/files/fileSelector';
import FileItemIcon from './FileItemIcon';
import FileItemName from './FileItemName';
import FileItemMenu from './FileItemMenu';
import FileItemToggle from './FileItemToggle';

function FileItem({
  item,
  hasChildren,
  isExpanded,
  onToggleExpand,
  dragHandlers,
  isDragging,
  isDropTarget,
}) {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const currentFileId = useSelector(selectCurrentFileId);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [showMenu, setShowMenu] = useState(false);

  const isActiveFolder = item.type === 'folder' && item.id === currentFolderId;
  const isCurrentFile = item.type === 'file' && item.id === currentFileId;

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
      dispatch(renameItem({ id: item.id, name: newName.trim() }));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    const message = hasChildren
      ? `Supprimer "${item.name}" et tout son contenu ?`
      : `Supprimer "${item.name}" ?`;

    if (confirm(message)) {
      dispatch(removeItem(item.id));
    }
    setShowMenu(false);
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

  // Gestionnaires de drag and drop
  const handleDragStart = (e) => {
    if (isEditing) return;
    dragHandlers?.handleDragStart(e, item);
  };

  const handleDragEnd = (e) => {
    dragHandlers?.handleDragEnd(e);
  };

  const handleDragOver = (e) => {
    if (item.type === 'folder') {
      dragHandlers?.handleDragOver(e, item);
    }
  };

  const handleDragLeave = (e) => {
    dragHandlers?.handleDragLeave(e);
  };

  const handleDrop = (e) => {
    if (item.type === 'folder') {
      dragHandlers?.handleDrop(e, item);
    }
  };

  return (
    <div className="relative">
      <div
        className={
          `flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group transition-all ${
            isActiveFolder
              ? 'bg-blue-100 hover:bg-blue-200'
              : 'hover:bg-gray-200'
          }` +
          (isCurrentFile ? ' text-blue-800' : '') +
          (isDragging ? ' opacity-50 cursor-move' : '') +
          (isDropTarget ? ' bg-blue-200 ring-2 ring-blue-400 ring-inset' : '')
        }
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
          isActiveFile={isCurrentFile}
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

        {isDropTarget && item.type === 'folder' && (
          <span className="ml-auto text-xs text-blue-600 font-semibold">
            Déposer ici
          </span>
        )}

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
    </div>
  );
}

export default FileItem;
