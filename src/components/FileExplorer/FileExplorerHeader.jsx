import { FolderPlus, X } from 'lucide-react';

function FileExplorerHeader({ currentFolder, onGoToRoot }) {
  return (
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
              onClick={onGoToRoot}
              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
              title="Retour à la racine"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileExplorerHeader;
