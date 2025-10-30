import './App.css';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MarkdownEditor from './components/MarkdownEditor/MarkdownEditor';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import BlockList from './blocks/components/BlockList';
import {
  selectCurrentFile,
  selectCurrentFilePath,
} from './features/files/fileSelector';
import Layout from './components/Layout';

function App() {
  const currentFile = useSelector(selectCurrentFile);
  const currentFilePath = useSelector(selectCurrentFilePath);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: '#f59e0b',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#f59e0b',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              currentFile ? (
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
              )
            }
          />
          <Route
            path="/images"
            element={<ImageLibrary onClose={() => window.history.back()} />}
          />
          <Route
            path="/blocs"
            element={<BlockList onClose={() => window.history.back()} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
