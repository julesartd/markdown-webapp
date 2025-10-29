import React, { useState, useEffect, useMemo, useRef } from 'react'; // 1. Importer useRef
import { useSelector, useDispatch } from 'react-redux';
import {updateFileContent,} from '../../features/files/fileSlice';
import { marked } from 'marked';
import EditorPane from './EditorPane';
import PreviewPane from './PreviewPane';
import {selectCurrentFile} from "../../features/files/fileSelector.js";

function MarkdownEditor() {
    const dispatch = useDispatch();
    const currentFile = useSelector(selectCurrentFile);
    const [localContent, setLocalContent] = useState('');
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (currentFile) {
            setLocalContent(currentFile.content);
        } else {
            setLocalContent('');
        }
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
    }, [currentFile]);

    const handleContentChange = (newContent) => {
        setLocalContent(newContent);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            if (currentFile && newContent !== currentFile.content) {
                dispatch(
                    updateFileContent({
                        id: currentFile.id,
                        content: newContent,
                    })
                );
            }
        }, 300);
    };

    const getHtml = useMemo(() => {
        if (!currentFile) return '';
        return marked.parse(localContent || '');
    }, [localContent, currentFile]);
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