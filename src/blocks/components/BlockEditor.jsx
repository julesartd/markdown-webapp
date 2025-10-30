<<<<<<< HEAD
import { useState, version } from "react";
=======
import { useState } from "react";
>>>>>>> 69e75e75cc610d349fbc8c59fafe2ac68a9fe52f
import { useDispatch } from "react-redux";
import { updateBlock } from "../blocksSlice";
import { marked } from "marked";
import DOMPurify from "dompurify";

function BlockEditor({ block, removeBlock }) {
  const dispatch = useDispatch();
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [editedContent, setEditedContent] = useState(block.content);

  const renderBlockContent = (block) => {
    let html = block.type === "markdown" ? marked.parse(block.content) : block.content;
    return { __html: DOMPurify.sanitize(html) };
  };

  const handleSaveEdit = () => {
    dispatch(updateBlock({ id: block.id, name: block.name, content: editedContent }));
    setEditingBlockId(null);
  };

  return (
    <article className="border rounded-lg bg-white shadow-sm p-4 flex flex-col h-full">
      <header className="flex items-center justify-between mb-2">
        <h3 className="text-md font-medium">{block.name}</h3>
        <span className="text-xs text-gray-500 px-2 py-1 border rounded">{block.type}</span>
      </header>

      <section className="flex-1 overflow-auto prose max-w-none">
        {editingBlockId === block.id ? (
          <>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="border p-2 rounded w-full h-24 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-sm border rounded bg-green-600 text-white hover:bg-green-700"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEditingBlockId(null)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </>
        ) : (
          <div dangerouslySetInnerHTML={renderBlockContent(block)} />
        )}
      </section>

      {editingBlockId !== block.id && (
        <footer className="mt-3 flex gap-2">
          <button
            onClick={() => setEditingBlockId(block.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Éditer
          </button>
          <button
            onClick={removeBlock}
            className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </footer>
      )}
    </article>
  );
}

export default BlockEditor;
