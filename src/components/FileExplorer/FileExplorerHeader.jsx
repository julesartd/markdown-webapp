import { FolderTree } from 'lucide-react';

function FileExplorerHeader() {
  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2">
        <FolderTree className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-800">Explorateur</h2>
      </div>
    </div>
  );
}

export default FileExplorerHeader;
