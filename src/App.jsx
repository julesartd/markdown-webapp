import './App.css';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
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
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            {currentFile ? (
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
            )}
          </Layout>
        }
      />
      <Route
        path="/images"
        element={
          <Layout>
            <ImageLibrary onClose={() => window.history.back()} />
          </Layout>
        }
      />
      <Route
        path="/blocs"
        element={
          <Layout>
            <BlockList onClose={() => window.history.back()} />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
