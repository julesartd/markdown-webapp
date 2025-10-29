function FileItemName({
  item,
  isEditing,
  newName,
  isActiveFolder,
  onNameChange,
  onRename,
  onCancelEdit,
  onClick,
    isActiveFile,
}) {
  if (isEditing) {
    return (
      <input
        type="text"
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={onRename}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onRename();
          if (e.key === 'Escape') onCancelEdit();
        }}
        autoFocus
        className="flex-1 px-1 py-0.5 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    );
  }

  return (
    <span
      className={`flex-1 text-sm truncate ${
        isActiveFolder ? 'font-semibold' : ''
      }
      ${isActiveFile ? 'font-semibold' : ''}`}
      onClick={onClick}
    >
      {item.name}
    </span>
  );
}

export default FileItemName;
