import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addBlock } from "../../features/blocks/blocksSlice.js";
import ShortcutInput from "../ShortcutInput/ShortcutInput.jsx";

function BlockAdd() {
    const dispatch = useDispatch();
    const [newBlock, setNewBlock] = useState({
        name: "",
        type: "markdown",
        content: "",
        shortcut: "",
    });

    const handleAddBlock = (e) => {
        e.preventDefault();
        if (!newBlock.name || !newBlock.content) {
            toast.error("Le nom et le contenu sont obligatoires");
            return;
        }
        dispatch(addBlock(newBlock));
        toast.success(`Bloc "${newBlock.name}" créé avec succès`);
        setNewBlock({ name: "", type: "markdown", content: "", shortcut: "" });
    };

    return (
        <form onSubmit={handleAddBlock} className="flex flex-col gap-4">
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Nom du bloc"
                    value={newBlock.name}
                    onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                />
                <select
                    value={newBlock.type}
                    onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors w-32"
                >
                    <option value="markdown">Markdown</option>
                    <option value="html">HTML</option>
                </select>
            </div>

            <textarea
                placeholder="Contenu du bloc..."
                value={newBlock.content}
                onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[100px] resize-y"
                required
            />

            <ShortcutInput
                value={newBlock.shortcut}
                onChange={(shortcutString) => setNewBlock({ ...newBlock, shortcut: shortcutString })}
                placeholder="Cliquer pour définir un raccourci"
            />

            <button
                type="submit"
                className="self-start px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
                Ajouter le bloc
            </button>
        </form>
    );
}

export default BlockAdd;