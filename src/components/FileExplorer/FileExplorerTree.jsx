import FileTree from '../FileTree/FileTree';

function FileExplorerTree({ dragAndDrop, onFileSelect }) {
  const dragHandlers = {
    handleDragStart: dragAndDrop.handleDragStart,
    handleDragEnd: dragAndDrop.handleDragEnd,
    handleDragOver: dragAndDrop.handleDragOver,
    handleDragLeave: dragAndDrop.handleDragLeave,
    handleDrop: dragAndDrop.handleDrop,
  };

  const isDropTargetRoot =
    dragAndDrop.dropTarget === null && dragAndDrop.draggedItem !== null;

  return (
    <div
      className={`flex-1 overflow-y-auto p-2 transition-all relative ${
        isDropTargetRoot ? 'bg-blue-200 ring-2 ring-blue-400 ring-inset' : ''
      }`}
      onDragOver={(e) => dragHandlers.handleDragOver(e, null)}
      onDrop={(e) => dragHandlers.handleDrop(e, null)}
      onDragLeave={(e) => dragHandlers.handleDragLeave(e)}
    >
      {isDropTargetRoot && (
        <div className="absolute top-2 right-2 text-xs text-blue-600 font-semibold bg-white px-2 py-1 rounded shadow-sm">
          Déposer ici
        </div>
      )}
      <FileTree
        parentId={null}
        dragHandlers={dragHandlers}
        draggedItemId={dragAndDrop.draggedItem?.id}
        dropTargetId={dragAndDrop.dropTarget}
        onFileSelect={onFileSelect}
      />
    </div>
  );
}

export default FileExplorerTree;
