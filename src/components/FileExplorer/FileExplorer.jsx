import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  selectCurrentFolderId,
  selectCurrentFolder,
} from '../../features/files/fileSelector';
import { selectImageCount } from '../../features/images/imageSelector';
import useDragAndDrop from '../../hooks/useDragAndDrop.js';
import FileExplorerHeader from './FileExplorerHeader';
import FileExplorerActions from './FileExplorerActions';
import FileExplorerTree from './FileExplorerTree';

function FileExplorer({ onOpenLibrary, onFileSelect }) {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const currentFolder = useSelector(selectCurrentFolder);
  const imageCount = useSelector(selectImageCount);
  const importFileRef = useRef(null);

  const handleMove = (itemId, newParentId) => {
    dispatch({ type: 'files/moveItem', payload: { itemId, newParentId } });
    toast.success('Élément déplacé avec succès');
  };
  const dragAndDrop = useDragAndDrop(handleMove);

  return (
    <div className="w-80 h-screen border-r border-gray-300 bg-gray-50 flex flex-col">
      <FileExplorerHeader />
      <FileExplorerActions
        currentFolder={currentFolder}
        currentFolderId={currentFolderId}
        imageCount={imageCount}
        importFileRef={importFileRef}
        onOpenLibrary={onOpenLibrary}
      />
      <FileExplorerTree dragAndDrop={dragAndDrop} onFileSelect={onFileSelect} />
    </div>
  );
}

export default FileExplorer;
