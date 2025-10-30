import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Ajout de useSelector
import { ImagePlus, FileUp, Download } from 'lucide-react';
import { updateFileContent } from '../../features/files/fileSlice';
import MarkdownPreview from './MarkdownPreview';
import ImagePicker from '../ImageLibrary/ImagePicker';

/**
 * Éditeur Markdown avec support d'images et prévisualisation côte à côte
 * @param {Object} file - Fichier en cours d'édition
 * @param {string} filePath - Chemin complet du fichier
 */
export default function MarkdownEditor({ file, filePath }) {
    const dispatch = useDispatch();
    const blocks = useSelector((state) => state.blocks.items);

    const [content, setContent] = useState(file.content || '');
    const [showImagePicker, setShowImagePicker] = useState(false);
    const textareaRef = useRef(null);
    const importFileRef = useRef(null);

    useEffect(() => {
        setContent(file.content || '');
    }, [file.id, file.content]);

    const handleContentChange = (newContent) => {
        setContent(newContent);
        dispatch(updateFileContent({ id: file.id, content: newContent }));
    };

    const insertTextIntoEditor = (textToInsert) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPos = textarea.selectionStart || content.length;

        const newContent =
            content.slice(0, cursorPos) +
            textToInsert +
            content.slice(cursorPos);

        handleContentChange(newContent);

        setTimeout(() => {
            textarea.focus();
            const newPos = cursorPos + textToInsert.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };


    const handleSelectFromLibrary = (image) => {
        const imageMarkdown = `![${image.name}](${image.id})`;
        insertTextIntoEditor(imageMarkdown);
    };

    const handleKeyDown = (e) => {
        const key = e.key.toUpperCase();
        if (['CONTROL', 'ALT', 'SHIFT', 'META', 'DEAD'].includes(key)) return;

        if (!e.ctrlKey && !e.altKey && !e.metaKey) return;

        let parts = [];
        if (e.ctrlKey) parts.push("Ctrl");
        if (e.altKey) parts.push("Alt");
        if (e.metaKey) parts.push("Cmd");
        if (e.shiftKey) parts.push("Shift");

        parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);

        const shortcutString = parts.join("+");

        const matchingBlock = blocks.find(
            (b) => b.shortcut && b.shortcut.toUpperCase() === shortcutString.toUpperCase()
        );

        if (matchingBlock) {
            e.preventDefault();
            insertTextIntoEditor("\n"+matchingBlock.content);
        }
    };

    const handleImportFile = (event) => {
        const uploadedFile = event.target.files?.[0];
        if (!uploadedFile) return;

        if (!uploadedFile.name.endsWith('.md')) {
            alert('Veuillez sélectionner un fichier Markdown (.md)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            handleContentChange(fileContent);
        };
        reader.onerror = () => {
            alert('Erreur lors de la lecture du fichier');
        };
        reader.readAsText(uploadedFile);

        if (importFileRef.current) {
            importFileRef.current.value = '';
        }
    };

    const handleExportFile = () => {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Barre d'outils */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-700">{filePath || file.name}</h2>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 border-r border-gray-200 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Édition</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => importFileRef.current?.click()}
                                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                    title="Importer un fichier .md"
                                >
                                    <FileUp size={14} />
                                    Importer
                                </button>
                                <button
                                    onClick={() => setShowImagePicker(true)}
                                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                                    title="Insérer une image"
                                >
                                    <ImagePlus size={14} />
                                    Image
                                </button>
                            </div>
                        </div>

                        <input
                            ref={importFileRef}
                            type="file"
                            accept=".md"
                            onChange={handleImportFile}
                            className="hidden"
                        />
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            onKeyDown={handleKeyDown} // Ajout du listener
                            className="flex-1 w-full px-4 py-3 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                            placeholder="Écrivez votre contenu en Markdown..."
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Aperçu</h3>
                            <button
                                onClick={handleExportFile}
                                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                                title="Exporter en fichier .md"
                            >
                                <Download size={14} />
                                Exporter
                            </button>
                        </div>
                        <MarkdownPreview content={content} />
                    </div>
                </div>
            </div>

            <ImagePicker
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onSelect={handleSelectFromLibrary}
            />
        </div>
    );
}