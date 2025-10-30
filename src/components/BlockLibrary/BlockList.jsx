import { useSelector, useDispatch } from "react-redux";
import BlockAdd from "./BlockAdd.jsx";
import BlockEditor from "./BlockEditor.jsx";
import { addBlock, removeBlock } from "../../features/blocks/blocksSlice.js";
import { ArrowLeft, FolderOpen, Download } from "lucide-react";

function BlockList({onClose}) {
    const dispatch = useDispatch();
    const blocks = useSelector((state) => state.blocks.items);

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
        <div className="h-full flex flex-col bg-gray-50">
            <header className="p-5 bg-white border-b border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={onClose}
                    >
                        <ArrowLeft size={16} /> Retour
                    </button>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            <span>Bibliothèque de blocs</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Gérez vos blocs personnalisés pour vos projets Markdown
                        </p>
                    </div>
                </div>


                <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">

                    <button
                        onClick={handleExportAllBlocks}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Download size={16} /> Exporter tous les blocs
                    </button>

                    <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                        <FolderOpen size={16} /> Importer
                        <input type="file" accept=".part.mdlc,.parts.mdlc" className="hidden" onChange={handleImport} />
                    </label>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Ajouter un nouveau bloc
                    </h3>
                    <BlockAdd />
                </div>

                {blocks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blocks.map((block) => (
                            <BlockEditor
                                key={block.id}
                                block={block}
                                removeBlock={() => dispatch(removeBlock(block.id))}
                            />
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