import { useDispatch } from 'react-redux';
import { FilePlus, FolderPlus, Images, FileUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { addFile, addFolder } from '../../features/files/fileSlice';

function FileExplorerActions({
  currentFolder,
  currentFolderId,
  imageCount,
  importFileRef,
  onOpenLibrary,
}) {
  const dispatch = useDispatch();

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
      {/* Créer */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Créer
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
      {/* Bibliothèque */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Ressources
        </p>
        <button
          onClick={onOpenLibrary}
          className="w-full px-3 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-2 font-medium"
        >
          <Images size={16} /> Bibliothèque{' '}
          {imageCount > 0 && `(${imageCount})`}
        </button>
      </div>
    </div>
  );
}

export default FileExplorerActions;
