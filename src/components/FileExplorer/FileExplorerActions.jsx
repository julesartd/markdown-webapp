import { useDispatch } from 'react-redux';
import { FilePlus, FolderPlus, Images, FileUp, BookOpen, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { addFile, addFolder, setCurrentFolder } from '../../features/files/fileSlice';

function FileExplorerActions({
  currentFolder,
  currentFolderId,
  imageCount,
  importFileRef,
  onOpenLibrary,
  onOpenLibraryBlock,
}) {
  const dispatch = useDispatch();

  const handleDeselectFolder = () => {
    dispatch(setCurrentFolder(null));
    toast.success('Retour à la racine');
  };

  const handleAddFile = () => {
    dispatch(
      addFile({
        name: 'nouveau-fichier.md',
        content: '',
        parentId: currentFolderId,
      })
    );
    toast.success('Nouveau fichier créé');
  };

  const handleAddFolder = () => {
    dispatch(
      addFolder({
        name: 'nouveau-dossier',
        parentId: currentFolderId,
      })
    );
    toast.success('Nouveau dossier créé');
  };

  const handleImportFile = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    if (!uploadedFile.name.endsWith('.md')) {
      toast.error('Veuillez sélectionner un fichier Markdown (.md)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch(
        addFile({
          name: uploadedFile.name,
          content: e.target.result,
          parentId: currentFolderId,
        })
      );
      toast.success(`Fichier "${uploadedFile.name}" importé avec succès`);
    };
    reader.onerror = () => toast.error('Erreur lors de la lecture du fichier');
    reader.readAsText(uploadedFile);
    if (importFileRef.current) importFileRef.current.value = '';
  };

  return (
    <div className="space-y-2 p-4 border-b border-gray-300 bg-white">
      {/* Indicateur de dossier courant avec bouton de déselection */}
      {currentFolderId && (
        <div className="mb-2 flex items-center justify-between px-2 py-1.5 bg-blue-50 border border-blue-200 rounded text-xs">
          <span className="text-blue-700 font-medium truncate">
            Dans : {currentFolder?.name}
          </span>
          <button
            onClick={handleDeselectFolder}
            className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="Revenir à la racine"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Créer */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Créer {currentFolderId ? 'ici' : 'à la racine'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAddFile}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2"
          >
            <FilePlus size={16} /> Fichier
          </button>
          <button
            onClick={handleAddFolder}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2"
          >
            <FolderPlus size={16} /> Dossier
          </button>
        </div>
      </div>
      {/* Importer */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Importer
        </p>
        <button
          onClick={() => importFileRef.current?.click()}
          className="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2"
        >
          <FileUp size={16} /> Fichier .md
        </button>
        <input
          ref={importFileRef}
          type="file"
          accept=".md"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>
      {/* Bibliothèque d'images */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Ressources
        </p>
        <button
          onClick={onOpenLibrary}
          className="w-full px-3 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-2 font-medium"
        >
          <Images size={16} /> Bibliothèque d'images{' '}
          {imageCount > 0 && `(${imageCount})`}
        </button>
      </div>

      {/* Bibliothèque de blocs */}
      <div>
        <button
          onClick={onOpenLibraryBlock}
          className="w-full px-3 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-2 font-medium"
          title="Ouvrir la bibliothèque de blocs"
        >
          <BookOpen size={16} />
          Bibliothèque de blocs
        </button>
      </div>
    </div>
  );
}

export default FileExplorerActions;
