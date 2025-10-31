import './App.css';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FileText, FolderPlus, FilePlus } from 'lucide-react';
import MarkdownEditor from './components/MarkdownEditor/MarkdownEditor';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import BlockList from './components/BlockLibrary/BlockList.jsx';
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
        containerStyle={{
          zIndex: 99999,
        }}
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
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center max-w-md px-6">
                    {/* Icône principale */}
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full blur-xl opacity-60"></div>
                      </div>
                      <FileText className="mx-auto h-24 w-24 text-blue-500 relative" strokeWidth={1.5} />
                    </div>

                    {/* Titre et description */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                      Bienvenue dans Markdown Editor
                    </h1>
                    <p className="text-base text-gray-600 mb-8">
                      Aucun fichier sélectionné. Commencez par créer ou sélectionner un fichier Markdown.
                    </p>

                    {/* Actions rapides */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-left p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <FilePlus className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            Créer un fichier
                          </h3>
                          <p className="text-xs text-gray-600">
                            Utilisez le bouton "Fichier" dans la barre latérale pour créer un nouveau fichier Markdown
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-left p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <FolderPlus className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            Organiser avec des dossiers
                          </h3>
                          <p className="text-xs text-gray-600">
                            Créez des dossiers pour organiser vos fichiers et projets
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <p className="mt-8 text-xs text-gray-500">
                      Vos fichiers sont sauvegardés automatiquement dans votre navigateur
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
