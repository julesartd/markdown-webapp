import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlock } from "../blocksSlice";

function BlockAdd() {
  const dispatch = useDispatch();
  const [newBlock, setNewBlock] = useState({
    name: "",
    type: "markdown",
    content: "",
  });

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (!newBlock.name || !newBlock.content) return;
    dispatch(addBlock(newBlock));
    setNewBlock({ name: "", type: "markdown", content: "" });
  };

  return (
    <form onSubmit={handleAddBlock} className="border p-4 rounded-lg bg-white shadow-sm flex flex-col gap-3">
      <input
        type="text"
        placeholder="Nom du bloc"
        value={newBlock.name}
        onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <select
        value={newBlock.type}
        onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="markdown">Markdown</option>
        <option value="html">HTML</option>
      </select>

      <textarea
        placeholder="Contenu du bloc..."
        value={newBlock.content}
        onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
        className="border p-2 rounded w-full h-24 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
