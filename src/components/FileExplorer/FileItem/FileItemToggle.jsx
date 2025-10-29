function FileItemToggle({ item, isExpanded, onToggle }) {
  if (item.type !== 'folder') return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <span
      className="text-xs select-none w-4 hover:bg-gray-300 rounded flex items-center justify-center"
      onClick={handleClick}
    >
      {isExpanded ? '▼' : '▶'}
    </span>
  );
}

export default FileItemToggle;
