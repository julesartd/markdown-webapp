import './App.css';
import FileExplorer from './components/FileExplorer/FileExplorer';
import MarkdownEditor from "./components/MarkdownEditor/MarkdownEditor.jsx";
import BlockList from './blocks/components/BlockList.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <div className="flex h-screen overflow-hidden">
                        <FileExplorer />
                        <MarkdownEditor />
                    </div>
                } 
            />
            <Route 
                path="/blocks" 
                element={
                    <div className="flex h-screen overflow-hidden">
                        <BlockList />
                    </div>
                } 
            />
        </Routes>
    );
}

export default App;
