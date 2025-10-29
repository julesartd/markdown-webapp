import { useState } from 'react';

const useDragAndDrop = (onMove) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragOver = (e, targetItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    // Drop sur un dossier ou sur la racine
    if (
      !targetItem ||
      (targetItem?.type === 'folder' && targetItem.id !== draggedItem.id)
    ) {
      e.dataTransfer.dropEffect = 'move';
      setDropTarget(targetItem?.id || null);
    }
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    setDropTarget(null);
  };

  const handleDrop = (e, targetItem = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    const targetId = targetItem?.id || null;

    if (draggedItem.id === targetId) {
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    if (draggedItem.parentId === targetId) {
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    if (onMove) {
      onMove(draggedItem.id, targetId);
    }

    setDraggedItem(null);
    setDropTarget(null);
  };

  return {
    draggedItem,
    dropTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useDragAndDrop;
