import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateBlock } from "../../features/blocks/blocksSlice.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
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
        if (!editedContent.trim()) {
            toast.error("Le contenu ne peut pas être vide");
            return;
        }
        dispatch(updateBlock({
            id: block.id,
            name: block.name,
            content: editedContent,
            shortcut: editedShortcut
        }));
        setEditingBlockId(null);
        toast.success(`Bloc "${block.name}" mis à jour`);
    };

    const handleCancelEdit = () => {
        setEditingBlockId(null);
        setEditedContent(block.content);
        setEditedShortcut(block.shortcut || "");
    };

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
        toast.success(`Bloc "${block.name}" exporté`);
    };

    const handleRemove = () => {
        removeBlock();
        toast.success(`Bloc "${block.name}" supprimé`);
    };

    return (
        <article className="border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col h-full max-h-[400px]">
            <header className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">{block.name}</h3>
                <div className="flex items-center gap-2">
                    {block.shortcut && !editingBlockId && (
                        <kbd className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200 font-mono">
                            {block.shortcut}
                        </kbd>
                    )}
                    <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 border border-gray-200 rounded">
                        {block.type}
                    </span>
                </div>
            </header>

            <section className="flex-1 overflow-auto">
                {editingBlockId === block.id ? (
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[120px] resize-y"
                        />
                        <ShortcutInput
                            value={editedShortcut}
                            onChange={(shortcutString) => setEditedShortcut(shortcutString)}
                            placeholder="Cliquer pour définir un raccourci"
                        />
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none markdown-preview" dangerouslySetInnerHTML={renderBlockContent(block)} />
                )}
            </section>

            {editingBlockId !== block.id && (
                <footer className="mt-3 flex items-center gap-2 pt-3 border-t border-gray-200">
                    <button
                        onClick={() => setEditingBlockId(block.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Éditer"
                    >
                        <Edit2 size={14} />
                        Éditer
                    </button>

                    <button
                        onClick={handleExportOneBlock}
                        className="p-2 text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Exporter ce bloc"
                    >
                        <Download size={16} />
                    </button>

                    <button
                        onClick={handleRemove}
                        className="p-2 text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors"
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