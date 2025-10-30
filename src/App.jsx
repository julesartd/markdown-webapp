import './App.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import FileExplorer from './components/FileExplorer/FileExplorer';
import MarkdownEditor from './components/MarkdownEditor/MarkdownEditor';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import { selectCurrentFile, selectCurrentFilePath } from './features/files/fileSelector';
import BlockList from './blocks/components/BlockList';
import { Cpu } from 'lucide-react';

function App() {
  const currentFile = useSelector(selectCurrentFile);
  const currentFilePath = useSelector(selectCurrentFilePath);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);

  // Fermer la bibliothèque quand un fichier est sélectionné
  const handleFileExplorerInteraction = () => {
    if (showLibrary) {
      setShowLibrary(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <FileExplorer
        onOpenLibrary={() => setShowLibrary(true)}
        onFileSelect={handleFileExplorerInteraction}
        onOpenLibraryBlock={() => setShowBlockLibrary(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {showLibrary ? (
          <ImageLibrary onClose={() => setShowLibrary(false)} />
        ) : showBlockLibrary ? (
          <BlockList onClose={() => setShowBlockLibrary(false)} />
        ) : currentFile ? (
          <MarkdownEditor file={currentFile} filePath={currentFilePath} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-lg font-medium text-gray-500 mb-2">
                Aucun fichier sélectionné
              </h2>
              <p className="text-sm text-gray-400">
                Sélectionnez ou créez un fichier pour commencer
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
