import FileTree from '../FileTree/FileTree';

function FileExplorerDropZone({
  isDropTarget,
  dragHandlers,
  draggedItemId,
  dropTargetId,
}) {
  return (
    <div
      className={`flex-1 overflow-y-auto p-2 transition-all relative ${
        isDropTarget ? 'bg-blue-200 ring-2 ring-blue-400 ring-inset' : ''
      }`}
      onDragOver={(e) => dragHandlers.handleDragOver(e, null)}
      onDrop={(e) => dragHandlers.handleDrop(e, null)}
      onDragLeave={(e) => dragHandlers.handleDragLeave(e)}
    >
      {isDropTarget && (
        <div className="absolute top-2 right-2 text-xs text-blue-600 font-semibold bg-white px-2 py-1 rounded shadow-sm">
          Déposer ici
        </div>
      )}
      <FileTree
        parentId={null}
        dragHandlers={dragHandlers}
        draggedItemId={draggedItemId}
        dropTargetId={dropTargetId}
      />
    </div>
  );
}

export default FileExplorerDropZone;
