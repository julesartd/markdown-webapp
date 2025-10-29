import { useSelector, useDispatch } from 'react-redux';
import { FilePlus, FolderPlus, X } from 'lucide-react';
import {
  addFile,
  addFolder,
  setCurrentFolder,
} from '../../features/files/fileSlice';
import {
  selectCurrentFolderId,
  selectCurrentFolder,
} from '../../features/files/fileSelector';
import FileTree from '../FileTree/FileTree';
import { useNavigate } from "react-router-dom";

function FileExplorer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const currentFolder = useSelector(selectCurrentFolder);

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

  return (
    <div className="w-80 h-screen border-r border-gray-300 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <h2 className="text-xl font-semibold mb-3">Explorateur</h2>
        <button
              onClick={() => navigate('/blocks')}
              className="w-full mb-3 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Ouvrir la bibliothèque de blocs
        </button>

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

        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <FileTree parentId={null} />
      </div>
    </div>
  );
}

export default FileExplorer;
