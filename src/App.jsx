import './App.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Images } from 'lucide-react';
import FileExplorer from './components/FileExplorer/FileExplorer';
import MarkdownEditor from './components/MarkdownEditor/MarkdownEditor';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import { selectCurrentFile } from './features/files/fileSelector';
import { selectImageCount } from './features/images/imageSelector';

function App() {
  const currentFile = useSelector(selectCurrentFile);
  const imageCount = useSelector(selectImageCount);
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <FileExplorer />

      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* Bouton flottant pour ouvrir la bibliothèque */}
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
            showLibrary
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          title="Bibliothèque d'images"
        >
          <Images size={20} />
          <span className="text-sm font-medium">
            Bibliothèque {imageCount > 0 && `(${imageCount})`}
          </span>
        </button>

        {showLibrary ? (
          <ImageLibrary />
        ) : currentFile ? (
          <MarkdownEditor file={currentFile} />
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
