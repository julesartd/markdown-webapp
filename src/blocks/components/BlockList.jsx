import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BlockAdd from "./BlockAdd";
import BlockEditor from "./BlockEditor";
import { addBlock, removeBlock } from "../blocksSlice";

function BlockList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks.items);

  // Exporter tous les blocs
  const handleExportAllBlocks = () => {
    const data = { version: 1, blocks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mes-blocs.parts.mdlc";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importer un ou plusieurs blocs
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.blocks && Array.isArray(data.blocks)) {
          data.blocks.forEach((block) => dispatch(addBlock(block)));
        } else {
          alert("Fichier invalide : aucun bloc trouvé");
        }
      } catch (error) {
        alert("Erreur lors du chargement du fichier");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 border-l border-gray-200">
      {/* Header */}
      <header className="p-5 bg-white border-b border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            📚 <span>Bibliothèque de blocs</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos blocs personnalisés pour vos projets Markdown
          </p>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow transition"
          >
            ← Retour à l’accueil
          </button>

          <button
            onClick={handleExportAllBlocks}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 hover:shadow transition"
          >
            ⬇️ Exporter tous les blocs
          </button>

          <label className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-sm hover:bg-yellow-600 hover:shadow transition cursor-pointer">
            📂 Importer
            <input type="file" accept=".part.mdlc,.parts.mdlc" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Ajouter un bloc */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ➕ Ajouter un nouveau bloc
          </h3>
          <BlockAdd />
        </div>

        {/* Liste des blocs */}
        {blocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
              >
                <BlockEditor
                  block={block}
                  removeBlock={() => dispatch(removeBlock(block.id))}
                />

                {/* Export individuel */}
                <button
                  onClick={() => {
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
                  }}
                  className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  ⬇️ Exporter ce bloc
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 py-16">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg font-medium">Aucun bloc enregistré</p>
            <p className="text-sm text-gray-400">
              Ajoutez votre premier bloc pour commencer à construire votre bibliothèque.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default BlockList;
