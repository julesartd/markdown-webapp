import React from 'react';

function EditorPane({ value, onContentChange }) {
    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
            <h2 className="text-center bg-gray-800 text-white p-2 font-semibold tracking-wide text-sm">
                Markdown
            </h2>
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