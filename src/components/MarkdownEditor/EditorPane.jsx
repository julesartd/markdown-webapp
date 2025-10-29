import React from 'react';
import ExportButton from "../FileActions/ExportButton.jsx";
import { Download } from 'lucide-react';
function EditorPane({ value, onContentChange, filePath,onExport }) {
    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
            <div className="flex items-center justify-center gap-4 bg-gray-800 text-white p-2 font-semibold tracking-wide text-sm overflow-hidden">
                <h2 className="truncate" title={filePath}>
                    {filePath || 'Markdown'}
                </h2>
                {filePath && (
                    <ExportButton
                        onClick={onExport}
                        icon={<Download size={16} />}
                        text={null}
                        className="hover:bg-gray-700 rounded transition flex-shrink-0"
                        title="Exporter ce fichier"
                    />
                )}
            </div>

            <textarea
                className="flex-1 w-full h-full p-4 font-mono text-sm border-0 focus:ring-0 resize-none outline-none"
                value={value}
                onChange={(e) => onContentChange(e.target.value)}
                aria-label="Éditeur Markdown"
            />
        </div>
    );
}

export default EditorPane;