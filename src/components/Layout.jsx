import { Outlet, useNavigate } from 'react-router-dom';
import FileExplorer from './FileExplorer/FileExplorer';

function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
