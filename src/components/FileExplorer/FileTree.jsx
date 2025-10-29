import { useSelector } from 'react-redux';
import { selectItemsByParent } from '../../features/files/fileSlice';
import FileTreeItem from './FileTreeItem';

function FileTree({ parentId = null }) {
  const items = useSelector((state) => selectItemsByParent(state, parentId));

  return (
    <div className="file-tree">
      {items.map((item) => (
        <FileTreeItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export default FileTree;
