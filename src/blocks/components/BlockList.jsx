import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState } from "react";

const saveBlocksToLocalStorage = (blocks) => {
  localStorage.setItem("blocks", JSON.stringify(blocks));
};

const loadBlocksFromLocalStorage = () => {
  const stored = localStorage.getItem("blocks");
  return stored ? JSON.parse(stored) : [];
};

function BlockList() {

  const renderBlockContent = (block) => {
    let html = "";

    if (block.type === "markdown") {
      html = marked.parse(block.content);
    } else if (block.type === "html") {
      html = block.content;
    }

    const clean = DOMPurify.sanitize(html);
    return { __html: clean };
  };

  const [blocks, setBlocks] = useState(loadBlocksFromLocalStorage());

  const [newBlock, setNewBlock] = useState({
    name: "",
    type: "markdown",
    content: "",
  });

  const [editingBlockId, setEditingBlockId] = useState(null);
  const [editedContent, setEditedContent] = useState("");


  const handleAddBlock = (e) => {
    e.preventDefault();
    if (!newBlock.name || !newBlock.content) return;
    // Ajouter la modale d'erreur.
    

    const blockToAdd = {
      ...newBlock,
      id: crypto.randomUUID(),
    };

    setBlocks([...blocks, blockToAdd]);
    setNewBlock({ name: "", type: "", content: "" });
    saveBlocksToLocalStorage([...blocks, blockToAdd]);
  }

  const handleDeleteBlock = (id) => {
    setBlocks((prev) => {
      const updated = prev.filter((block) => block.id !== id);
      saveBlocksToLocalStorage(updated);
      return updated;
    })
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">📚 Bibliothèque — Aperçu</h2>

      <form
        onSubmit={handleAddBlock}
        className="border p-4 rounded-lg bg-gray-50 flex flex-col gap-3"
      >
        <h3 className="font-semibold text-lg">+ Ajouter un bloc</h3>

        <input
          type="text"
          placeholder="Nom du bloc"
          value={newBlock.name}
          onChange={(e) =>
            setNewBlock({ ...newBlock, name: e.target.value })
          }
          className="border p-2 rounded w-full"
        />

        <select
          value={newBlock.type}
          onChange={(e) =>
            setNewBlock({ ...newBlock, type: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>

        <textarea
          placeholder="Contenu du bloc..."
          value={newBlock.content}
          onChange={(e) =>
            setNewBlock({ ...newBlock, content: e.target.value })
          }
          className="border p-2 rounded w-full h-24 font-mono"
        />

        <button
          type="submit"
          className="self-start px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Ajouter
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {blocks.map((block) => (
          <article
            key={block.id}
            className="border rounded-lg bg-white shadow-sm p-4 flex flex-col h-full"
          >
            <header className="flex items-center justify-between mb-2">
              <h3 className="text-md font-medium">{block.name}</h3>
              <span className="text-xs text-gray-500 px-2 py-1 border rounded">
                {block.type}
              </span>
            </header>

            <section className="flex-1 overflow-auto prose max-w-none">
              {editingBlockId === block.id ? (
                <>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="border p-2 rounded w-full h-24 font-mono"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setBlocks((prev) => {
                          const updated = prev.map((b) =>
                            b.id === block.id ? { ...b, content: editedContent } : b
                          );
                          saveBlocksToLocalStorage(updated);
                          return updated;
                        });
                        setEditingBlockId(null);
                      }}
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
                  onClick={() => {
                    setEditingBlockId(block.id);
                    setEditedContent(block.content);
                  }}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Éditer
                </button>

                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </footer>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlockList;
