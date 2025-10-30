import { useSelector } from 'react-redux';
import MarkdownEditor from '../components/MarkdownEditor/MarkdownEditor';
import {
  selectCurrentFile,
  selectCurrentFilePath,
} from '../features/files/fileSelector';

export default function Home() {
  const currentFile = useSelector(selectCurrentFile);
  const currentFilePath = useSelector(selectCurrentFilePath);

  return currentFile ? (
    <MarkdownEditor file={currentFile} filePath={currentFilePath} />
  ) : (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-500 mb-2">
          Aucun fichier sélectionné
        </h2>
        <p className="text-sm text-gray-400">
          Sélectionnez ou créez un fichier pour commencer
        </p>
      </div>
    </div>
  );
}
