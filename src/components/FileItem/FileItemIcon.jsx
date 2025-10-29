function FileItemIcon({ item, isExpanded, onClick }) {
  const icon = item.type === 'folder' ? (isExpanded ? '📂' : '📁') : '📄';

  return (
    <span className="text-base" onClick={onClick}>
      {icon}
    </span>
  );
}

export default FileItemIcon;
