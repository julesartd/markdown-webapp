import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FilePlus, FolderPlus, Images, FileUp } from 'lucide-react';
import {
  addFile,
  addFolder,
} from '../../features/files/fileSlice';
import {
    selectCurrentFolderId,
    selectCurrentFolder,
} from '../../features/files/fileSelector';
import { selectImageCount } from '../../features/images/imageSelector';
import FileTree from '../FileTree/FileTree';

function FileExplorer({ onOpenLibrary }) {
  const dispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const currentFolder = useSelector(selectCurrentFolder);
  const imageCount = useSelector(selectImageCount);
  const importFileRef = useRef(null);

  const handleAddFile = () => {
    dispatch(
      addFile({
        name: 'nouveau-fichier.md',
        content: '',
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

  const handleImportFile = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.md')) {
      alert('Veuillez sélectionner un fichier Markdown (.md)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const fileName = uploadedFile.name;

      dispatch(
        addFile({
          name: fileName,
          content: fileContent,
          parentId: currentFolderId,
        })
      );
    };
    reader.onerror = () => {
      alert('Erreur lors de la lecture du fichier');
    };
    reader.readAsText(uploadedFile);

    // Reset input
    if (importFileRef.current) {
      importFileRef.current.value = '';
    }
  };

  return (
    <div className="w-80 h-screen border-r border-gray-300 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <h2 className="text-xl font-semibold mb-3">Explorateur</h2>

        <div className="space-y-2">
          {/* Section: Créer */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Créer</p>
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

          {/* Section: Importer */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Importer</p>
            <button
              onClick={() => importFileRef.current?.click()}
              className="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
              title="Importer un fichier .md"
            >
              <FileUp size={16} />
              Fichier .md
            </button>
            <input
              ref={importFileRef}
              type="file"
              accept=".md"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          {/* Section: Bibliothèque */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Ressources</p>
            <button
              onClick={onOpenLibrary}
              className="w-full px-3 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition flex items-center justify-center gap-2 font-medium"
              title="Ouvrir la bibliothèque d'images"
            >
              <Images size={16} />
              Bibliothèque {imageCount > 0 && `(${imageCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* Arborescence des fichiers */}
      <FileTree />
    </div>
  );
}

export default FileExplorer;
