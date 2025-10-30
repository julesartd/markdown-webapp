import { useSelector } from 'react-redux';
import { selectItemsByParent } from '../../features/files/fileSelector';
import FileItem from '../FileItem/FileItem';
import { useState } from 'react';
import FileTree from './FileTree';

function FileTreeItem({ item, dragHandlers, draggedItemId, dropTargetId, onFileSelect }) {
  const children = useSelector((state) => selectItemsByParent(state, item.id));
  const hasChildren = item.type === 'folder' && children.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  const isDragging = item.id === draggedItemId;
  const isDropTarget = item.id === dropTargetId;

  return (
    <div className="file-tree-item">
      <FileItem
        item={item}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        dragHandlers={dragHandlers}
        isDragging={isDragging}
        isDropTarget={isDropTarget}
        onFileSelect={onFileSelect}
      />
      {hasChildren && isExpanded && (
        <div className="file-tree-children pl-4">
          <FileTree
            parentId={item.id}
            dragHandlers={dragHandlers}
            draggedItemId={draggedItemId}
            dropTargetId={dropTargetId}
            onFileSelect={onFileSelect}
          />
        </div>
      )}
    </div>
  );
}

export default FileTreeItem;
