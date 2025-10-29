import './App.css';
import FileExplorer from './components/FileExplorer/FileExplorer';

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <FileExplorer />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold">Markdown Editor</h1>
      </main>
    </div>
  );
}

export default App;
