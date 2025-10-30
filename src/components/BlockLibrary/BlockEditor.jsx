import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBlock } from "../../features/blocks/blocksSlice.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
// Importer les nouvelles icônes
import { Edit2, Download, Trash2 } from "lucide-react";
import ShortcutInput from "../ShortcutInput/ShortcutInput.jsx";

function BlockEditor({ block, removeBlock }) {
    const dispatch = useDispatch();
    const [editingBlockId, setEditingBlockId] = useState(null);
    const [editedContent, setEditedContent] = useState(block.content);
    const [editedShortcut, setEditedShortcut] = useState(block.shortcut || "");

    const renderBlockContent = (block) => {
        let html = block.type === "markdown" ? marked.parse(block.content) : block.content;
        return { __html: DOMPurify.sanitize(html) };
    };

    const handleSaveEdit = () => {
        dispatch(updateBlock({
            id: block.id,
            name: block.name,
            content: editedContent,
            shortcut: editedShortcut
        }));
        setEditingBlockId(null);
    };

    const handleCancelEdit = () => {
        setEditingBlockId(null);
        setEditedContent(block.content);
        setEditedShortcut(block.shortcut || "");
    };

    // Logique d'export individuel (déplacée depuis BlockList.jsx)
    const handleExportOneBlock = () => {
        const blob = new Blob(
            [JSON.stringify({ version: 1, blocks: [block] }, null, 2)],
            { type: "application/json" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${block.name}.part.mdlc`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <article className="border border-gray-300 max-h-[300px] rounded-lg bg-white shadow-sm p-4 flex flex-col h-full">
            <header className="flex items-center justify-between mb-2">
                <h3 className="text-md font-medium">{block.name}</h3>
                <div className="flex items-center gap-2">
                    {block.shortcut && !editingBlockId && (
                        <kbd className="px-2 py-0.5 border bg-gray-100 text-gray-700 text-xs rounded font-mono">
                            {block.shortcut}
                        </kbd>
                    )}
                    <span className="text-xs text-gray-500 px-2 py-1 border rounded">{block.type}</span>
                </div>
            </header>

            <section className="flex-1 overflow-auto">
                {editingBlockId === block.id ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2"
                        />
                        <ShortcutInput
                            value={editedShortcut}
                            onChange={(shortcutString) => setEditedShortcut(shortcutString)}
                            placeholder="Cliquer pour définir un raccourci"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1 text-sm border rounded bg-green-600 text-white hover:bg-green-700"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={"prose prose-sm max-w-none markdown-preview"} dangerouslySetInnerHTML={renderBlockContent(block)} />
                )}
            </section>

            {editingBlockId !== block.id && (
                <footer className="mt-3 flex items-center gap-1 pt-2 border-t border-gray-100">
                    <button
                        onClick={() => setEditingBlockId(block.id)}
                        className="w-[30px] flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        title="Éditer"
                    >
                        <Edit2 size={14} />
                        Éditer
                    </button>

                    <button
                        onClick={handleExportOneBlock}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Exporter ce bloc"
                    >
                        <Download size={16} />
                    </button>

                    <button
                        onClick={removeBlock}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer ce bloc"
                    >
                        <Trash2 size={16} />
                    </button>
                </footer>
            )}
        </article>
    );
}

export default BlockEditor;