import './App.css';
import FileExplorer from './components/FileExplorer/FileExplorer';
import MarkdownEditor from "./components/MarkdownEditor/MarkdownEditor.jsx";

function App() {
    return (
        <div className="flex h-screen overflow-hidden">
            <FileExplorer/>
            <MarkdownEditor/>
        </div>
    );
}

export default App;
