import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import FileExplorer from './FileExplorer/FileExplorer';

function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
      <FileExplorer
        onOpenLibrary={() => navigate('/images')}
        onOpenLibraryBlock={() => navigate('/blocs')}
        onFileSelect={() => navigate('/')}
      />
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
