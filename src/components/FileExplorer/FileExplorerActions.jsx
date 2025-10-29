import { FilePlus, FolderPlus, Upload } from 'lucide-react';
import ImportButton from '../FileActions/ImportButton';

function FileExplorerActions({
  currentFolder,
  onAddFile,
  onAddFolder,
  onFileImported,
}) {
  return (
    <div className="pb-4">
      <div className="flex gap-3">
        <button
          onClick={onAddFile}
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
          onClick={onAddFolder}
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
          onFileImported={onFileImported}
          className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
          icon={<Upload size={16} />}
          text="Importer"
          title="Importer un fichier (.md)"
        />
      </div>
    </div>
  );
}

export default FileExplorerActions;
