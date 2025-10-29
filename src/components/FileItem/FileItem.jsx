import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

function FileItem({ item, hasChildren, isExpanded, onToggleExpand }) {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [showMenu, setShowMenu] = useState(false);

  const isActiveFolder = item.type === 'folder' && item.id === currentFolderId;

  const handleClick = () => {
    if (item.type === 'file') {
      dispatch(setCurrentFile(item.id));
    } else {
      dispatch(setCurrentFolder(item.id));
    }
  };

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      dispatch(renameItem({ id: item.id, name: newName.trim() }));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Supprimer "${item.name}" ?`)) {
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
        />

        <FileItemIcon
          item={item}
          isExpanded={isExpanded}
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
          className="px-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>

        <FileItemMenu
          item={item}
          showMenu={showMenu}
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
