import { useState } from "react";
import { useDispatch } from "react-redux";
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
        if (!newBlock.name || !newBlock.content) return;
        dispatch(addBlock(newBlock));
        setNewBlock({ name: "", type: "markdown", content: "", shortcut: "" });
    };

    return (
        <form onSubmit={handleAddBlock} className="flex flex-col gap-3">
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Nom du bloc"
                    value={newBlock.name}
                    onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2 focus:ring-indigo-100"
                    required
                />
                <select
                    value={newBlock.type}
                    onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="markdown">Markdown</option>
                    <option value="html">HTML</option>
                </select>
            </div>

            <textarea
                placeholder="Contenu du bloc..."
                value={newBlock.content}
                onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
            />

            <ShortcutInput
                value={newBlock.shortcut}
                onChange={(shortcutString) => setNewBlock({ ...newBlock, shortcut: shortcutString })}
                placeholder="Cliquer pour définir un raccourci"
            />

            <button
                type="submit"
                className="self-start px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
            >
                Ajouter
            </button>
        </form>
    );
}

export default BlockAdd;