import { Edit2, FilePlus, FolderPlus, Trash2 } from 'lucide-react';

function FileItemMenu({
  item,
  showMenu,
  hasChildren,
  onClose,
  onRename,
  onDelete,
  onAddFile,
  onAddFolder,
}) {
  if (!showMenu) return null;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[160px]">
        <button
          onClick={onRename}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          <Edit2 size={16} />
          Renommer
        </button>
        {item.type === 'folder' && (
          <>
            <button
              onClick={onAddFile}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FilePlus size={16} />
              Nouveau fichier
            </button>
            <button
              onClick={onAddFolder}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FolderPlus size={16} />
              Nouveau dossier
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${
            hasChildren ? 'text-red-700 font-medium' : 'text-red-600'
          }`}
        >
          <Trash2 size={16} />
          {hasChildren ? 'Supprimer tout' : 'Supprimer'}
        </button>
      </div>
    </>
  );
}

export default FileItemMenu;
