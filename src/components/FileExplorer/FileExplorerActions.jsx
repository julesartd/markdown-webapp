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
    <div className="space-y-3 p-4 border-b border-gray-200 bg-gray-50">
      {/* Indicateur de dossier courant avec bouton de déselection */}
      {currentFolderId && (
        <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs shadow-sm">
          <span className="text-blue-700 font-semibold truncate">
            📂 {currentFolder?.name}
          </span>
          <button
            onClick={handleDeselectFolder}
            className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
            title="Revenir à la racine"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Créer */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase mb-2 tracking-wide">
          {currentFolderId ? 'Créer ici' : 'Créer à la racine'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAddFile}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 flex items-center justify-center gap-2 font-medium transition-all shadow-sm"
          >
            <FilePlus size={16} /> Fichier
          </button>
          <button
            onClick={handleAddFolder}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-green-50 hover:border-green-400 hover:text-green-700 flex items-center justify-center gap-2 font-medium transition-all shadow-sm"
          >
            <FolderPlus size={16} /> Dossier
          </button>
        </div>
      </div>
      {/* Importer */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase mb-2 tracking-wide">
          Importer
        </p>
        <button
          onClick={() => importFileRef.current?.click()}
          className="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 flex items-center justify-center gap-2 font-medium transition-all shadow-sm"
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
      {/* Ressources */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase mb-2 tracking-wide">
          Ressources
        </p>
        <div className="space-y-2">
          <button
            onClick={onOpenLibrary}
            className="w-full px-3 py-2 text-sm border border-blue-300 bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 flex items-center justify-center gap-2 font-semibold transition-all shadow-sm"
          >
            <Images size={16} /> Bibliothèque d'images{' '}
            {imageCount > 0 && <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs">{imageCount}</span>}
          </button>

          <button
            onClick={onOpenLibraryBlock}
            className="w-full px-3 py-2 text-sm border border-indigo-300 bg-linear-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-indigo-200 flex items-center justify-center gap-2 font-semibold transition-all shadow-sm"
            title="Ouvrir la bibliothèque de blocs"
          >
            <BookOpen size={16} /> Bibliothèque de blocs
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileExplorerActions;
