import { useSelector, useDispatch } from 'react-redux';
import { FilePlus, FolderPlus, X, Upload } from 'lucide-react';
import {
  addFile,
  addFolder,
  setCurrentFolder,
  moveItem,
} from '../../features/files/fileSlice';
import {
  selectCurrentFolderId,
  selectCurrentFolder,
} from '../../features/files/fileSelector';
import FileTree from '../FileTree/FileTree';
import { useRef } from 'react';
import ImportButton from '../FileActions/ImportButton.jsx';
import useDragAndDrop from '../../hooks/useDragAndDrop.js';

function FileExplorer() {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const currentFolder = useSelector(selectCurrentFolder);
  useRef(null);

  const handleAddFile = () => {
    dispatch(
      addFile({
        name: 'nouveau.md',
        parentId: currentFolderId,
      })
    );
  };

  const handleAddFolder = () => {
    dispatch(
      addFolder({
        name: 'nouveau-dossier',
        parentId: currentFolderId,
      })
    );
  };

  const handleGoToRoot = () => {
    dispatch(setCurrentFolder(null));
  };

  const handleFileImported = ({ name, content }) => {
    dispatch(
      addFile({
        name,
        content,
        parentId: currentFolderId,
      })
    );
  };

  const handleMove = (itemId, newParentId) => {
    dispatch(moveItem({ itemId, newParentId }));
  };

  const dragAndDrop = useDragAndDrop(handleMove);

  const dragHandlers = {
    handleDragStart: dragAndDrop.handleDragStart,
    handleDragEnd: dragAndDrop.handleDragEnd,
    handleDragOver: dragAndDrop.handleDragOver,
    handleDragLeave: dragAndDrop.handleDragLeave,
    handleDrop: dragAndDrop.handleDrop,
  };

  const isDropTargetRoot =
    dragAndDrop.dropTarget === null && dragAndDrop.draggedItem !== null;

  return (
    <div className="w-fit h-screen border-r border-gray-300 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <h2 className="text-xl font-semibold mb-3">Explorateur</h2>

        {currentFolder && (
          <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FolderPlus size={16} className="text-blue-600" />
                <span className="font-medium">{currentFolder.name}</span>
              </span>
              <button
                onClick={handleGoToRoot}
                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                title="Retour à la racine"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAddFile}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
            title={
              currentFolder
                ? `Nouveau fichier dans ${currentFolder.name}`
                : 'Nouveau fichier à la racine'
            }
          >
            <FilePlus size={16} />
            Fichier
          </button>
          <button
            onClick={handleAddFolder}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
            title={
              currentFolder
                ? `Nouveau dossier dans ${currentFolder.name}`
                : 'Nouveau dossier à la racine'
            }
          >
            <FolderPlus size={16} />
            Dossier
          </button>
          <ImportButton
            onFileImported={handleFileImported}
            className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
            icon={<Upload size={16} />}
            text="Importer"
            title="Importer un fichier (.md)"
          />
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-2 transition-all relative ${
          isDropTargetRoot ? 'bg-blue-200 ring-2 ring-blue-400 ring-inset' : ''
        }`}
        onDragOver={(e) => dragHandlers.handleDragOver(e, null)}
        onDrop={(e) => dragHandlers.handleDrop(e, null)}
        onDragLeave={(e) => dragHandlers.handleDragLeave(e)}
      >
        {isDropTargetRoot && (
          <div className="absolute top-2 right-2 text-xs text-blue-600 font-semibold bg-white px-2 py-1 rounded shadow-sm">
            Déposer ici
          </div>
        )}
        <FileTree
          parentId={null}
          dragHandlers={dragHandlers}
          draggedItemId={dragAndDrop.draggedItem?.id}
          dropTargetId={dragAndDrop.dropTarget}
        />
      </div>
    </div>
  );
}

export default FileExplorer;
