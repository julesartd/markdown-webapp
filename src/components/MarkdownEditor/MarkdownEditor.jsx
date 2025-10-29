import React, { useState, useEffect } from 'react'; // 1. useRef et useMemo supprimés
import { useSelector, useDispatch } from 'react-redux';
import { updateFileContent } from '../../features/files/fileSlice';
import { marked } from 'marked';
import EditorPane from './EditorPane';
import PreviewPane from './PreviewPane';
import { selectCurrentFile } from '../../features/files/fileSelector.js';

function MarkdownEditor() {
    const dispatch = useDispatch();
    const currentFile = useSelector(selectCurrentFile);
    const [localContent, setLocalContent] = useState('');

    useEffect(() => {
        if (currentFile) {
            setLocalContent(currentFile.content);
        } else {
            setLocalContent('');
        }
    }, [currentFile])

    useEffect(() => {
        if (!currentFile || localContent === currentFile.content) {
            return;
        }
        const timer = setTimeout(() => {
            dispatch(
                updateFileContent({
                    id: currentFile.id,
                    content: localContent,
                })
            );
        }, 300);
        return () => {
            clearTimeout(timer);
        };

    }, [localContent, currentFile, dispatch]);

    
    const handleContentChange = (newContent) => {
        setLocalContent(newContent);
    };
    const getHtml = currentFile ? marked.parse(localContent || '') : '';

    if (!currentFile) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                    Sélectionnez un fichier pour commencer l'édition.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 h-full overflow-y-auto">
            <EditorPane
                value={localContent}
                onContentChange={handleContentChange}
            />
            <PreviewPane htmlContent={getHtml} />
        </div>
    );
}

export default MarkdownEditor;