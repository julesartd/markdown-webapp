import { File, Folder, FolderOpen } from 'lucide-react';

function FileItemIcon({ item, isExpanded, hasChildren, onClick }) {
  if (item.type === 'folder') {
    const FolderIcon = isExpanded ? FolderOpen : Folder;
    return (
      <FolderIcon
        size={18}
        className={`${
          hasChildren ? 'text-blue-600' : 'text-gray-400'
        } cursor-pointer`}
        onClick={onClick}
      />
    );
  }

  return (
    <File
      size={18}
      className="text-gray-600 cursor-pointer"
      onClick={onClick}
    />
  );
}

export default FileItemIcon;
