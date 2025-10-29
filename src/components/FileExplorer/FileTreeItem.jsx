import { useSelector } from 'react-redux';
import { selectItemsByParent } from '../../features/files/fileSelector';
import FileItem from '../FileItem/FileItem';
import { useState } from 'react';
import FileTree from './FileTree';

function FileTreeItem({ item }) {
  const children = useSelector((state) => selectItemsByParent(state, item.id));
  const hasChildren = item.type === 'folder' && children.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="file-tree-item">
      <FileItem
        item={item}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />
      {hasChildren && isExpanded && (
        <div className="file-tree-children pl-4">
          <FileTree parentId={item.id} />
        </div>
      )}
    </div>
  );
}
export default FileTreeItem;
