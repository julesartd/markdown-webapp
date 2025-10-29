import { ChevronRight, ChevronDown } from 'lucide-react';

function FileItemToggle({ item, isExpanded, onToggle, hasChildren }) {
  if (item.type !== 'folder') return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggle && hasChildren) {
      onToggle();
    }
  };

  const Icon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <span
      className="w-4 hover:bg-gray-300 rounded flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <Icon size={14} className="text-gray-600" />
    </span>
  );
}

export default FileItemToggle;
