import { useSelector, useDispatch } from 'react-redux';
import {
  addFile,
  addFolder,
  selectCurrentFolderId,
  selectCurrentFolder,
  setCurrentFolder,
} from '../../features/files/fileSlice';
import FileTree from './FileTree';

function FileExplorer() {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const currentFolder = useSelector(selectCurrentFolder);

  const handleAddFile = () => {
    console.log('Current Folder ID:', currentFolderId);
    dispatch(
      addFile({
        name: 'nouveau.md',
        parentId: currentFolderId,
      })
    );
  };

  const handleAddFolder = () => {
    console.log('Current Folder ID:', currentFolderId);
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

  return (
    <div className="w-80 h-screen border-r border-gray-300 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <h2 className="text-xl font-semibold mb-3">Explorateur</h2>

        {currentFolder && (
          <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                📁 <span className="font-medium">{currentFolder.name}</span>
              </span>
              <button
                onClick={handleGoToRoot}
                className="text-blue-600 hover:text-blue-800 text-xs"
                title="Retour à la racine"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAddFile}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition"
            title={
              currentFolder
                ? `Nouveau fichier dans ${currentFolder.name}`
                : 'Nouveau fichier à la racine'
            }
          >
            📄 Fichier
          </button>
          <button
            onClick={handleAddFolder}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition"
            title={
              currentFolder
                ? `Nouveau dossier dans ${currentFolder.name}`
                : 'Nouveau dossier à la racine'
            }
          >
            📁 Dossier
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <FileTree parentId={null} />
      </div>
    </div>
  );
}

export default FileExplorer;
