import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import toast from "react-hot-toast";
import BlockAdd from "./BlockAdd.jsx";
import BlockEditor from "./BlockEditor.jsx";
import { addBlock, removeBlock } from "../../features/blocks/blocksSlice.js";
import { ArrowLeft, FolderOpen, Download, Package } from "lucide-react";

function BlockList({onClose}) {
    const dispatch = useDispatch();
    const blocks = useSelector((state) => state.blocks.items);
    const importInputRef = useRef(null);

    const handleExportAllBlocks = () => {
        if (blocks.length === 0) {
            toast.error("Aucun bloc à exporter");
            return;
        }
        const data = { version: 1, blocks };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mes-blocs.parts.mdlc";
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`${blocks.length} bloc(s) exporté(s) avec succès`);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.mdlc')) {
            toast.error("Veuillez sélectionner un fichier .mdlc");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.blocks && Array.isArray(data.blocks)) {
                    const count = data.blocks.length;
                    data.blocks.forEach((block) => dispatch(addBlock(block)));
                    toast.success(`${count} bloc(s) importé(s) avec succès`);
                } else {
                    toast.error("Fichier invalide : aucun bloc trouvé");
                }
            } catch (error) {
                toast.error("Erreur lors du chargement du fichier");
                console.error(error);
            }
        };
        reader.onerror = () => {
            toast.error("Erreur lors de la lecture du fichier");
        };
        reader.readAsText(file);

        // Reset input
        if (importInputRef.current) {
            importInputRef.current.value = '';
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <ArrowLeft size={16} />
                                Retour
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Bibliothèque de blocs</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {blocks.length} bloc{blocks.length > 1 ? 's' : ''} • Gérez vos blocs personnalisés
                            </p>
                        </div>
                    </div>

                    {/* Actions globales */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => importInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FolderOpen size={16} />
                            Importer
                        </button>

                        <button
                            onClick={handleExportAllBlocks}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Download size={16} />
                            Exporter tous
                        </button>
                    </div>

                    {/* Input file caché pour import */}
                    <input
                        ref={importInputRef}
                        type="file"
                        accept=".part.mdlc,.parts.mdlc,.mdlc"
                        onChange={handleImport}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                    {/* Section d'ajout de bloc */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Ajouter un nouveau bloc
                        </h3>
                        <BlockAdd />
                    </div>

                    {/* Liste des blocs */}
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
                        <div className="text-center py-12">
                            <div className="flex justify-center mb-4">
                                <Package size={64} className="text-gray-300" strokeWidth={1.5} />
                            </div>
                            <p className="text-lg font-medium text-gray-700">Aucun bloc enregistré</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Créez votre premier bloc pour commencer.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlockList;