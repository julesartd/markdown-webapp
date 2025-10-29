import {useState, useEffect, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFileContent } from '../../features/files/fileSlice';
import { marked } from 'marked';
import EditorPane from './EditorPane';
import PreviewPane from './PreviewPane';
import {selectAllItems, selectCurrentFile} from '../../features/files/fileSelector.js';
import DOMPurify from 'dompurify';
import {exportAsFile} from "../../utils/fileExport.js";

function MarkdownEditor() {
    const dispatch = useDispatch();
    const currentFile = useSelector(selectCurrentFile);
    const [localContent, setLocalContent] = useState('');
    const allItems = useSelector(selectAllItems);

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

    const handleExportMarkdown = () => {
        if (!currentFile) return;
        const filename = currentFile.name.endsWith('.md')
            ? currentFile.name
            : `${currentFile.name}.md`;
        exportAsFile(
            localContent,
            filename,
            'text/markdown;charset=utf-8'
        );
    };

    const filePath = useMemo(() => {
        if (!currentFile || !allItems) return '';
        const itemsMap = new Map(allItems.map(item => [item.id, item]));
        const pathParts = [currentFile.name];
        let parentId = currentFile.parentId;
        while (parentId) {
            const parentFolder = itemsMap.get(parentId);
            if (parentFolder) {
                pathParts.unshift(parentFolder.name);
                parentId = parentFolder.parentId;
            } else {
                parentId = null;
            }
        }
        return pathParts.join('/');
    }, [currentFile, allItems]);


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
                filePath={filePath}
                value={localContent}
                onContentChange={handleContentChange}
                onExport={handleExportMarkdown}
            />
            <PreviewPane htmlContent={getHtml} />
        </div>
    );
}

export default MarkdownEditor;