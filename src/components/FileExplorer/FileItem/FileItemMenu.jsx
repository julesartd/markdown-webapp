function FileItemMenu({
  item,
  showMenu,
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
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        >
          ✏️ Renommer
        </button>
        {item.type === 'folder' && (
          <>
            <button
              onClick={onAddFile}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              📄 Nouveau fichier
            </button>
            <button
              onClick={onAddFolder}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              📁 Nouveau dossier
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
        >
          🗑️ Supprimer
        </button>
      </div>
    </>
  );
}

export default FileItemMenu;
