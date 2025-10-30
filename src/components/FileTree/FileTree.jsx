import { useSelector } from 'react-redux';
import { selectItemsByParent } from '../../features/files/fileSelector';
import FileTreeItem from './FileTreeItem';

function FileTree({
  parentId = null,
  dragHandlers,
  draggedItemId,
  dropTargetId,
  onFileSelect,
}) {
  const items = useSelector((state) => selectItemsByParent(state, parentId));

  return (
    <div className="file-tree">
      {items.map((item) => (
        <FileTreeItem
          key={item.id}
          item={item}
          dragHandlers={dragHandlers}
          draggedItemId={draggedItemId}
          dropTargetId={dropTargetId}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}

export default FileTree;
