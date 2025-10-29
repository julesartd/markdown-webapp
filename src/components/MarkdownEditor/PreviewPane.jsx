import React from 'react';
import DOMPurify from "dompurify";

function PreviewPane({ htmlContent }) {
    return (
        <div className="h-full flex flex-col border-l border-gray-300 overflow-y-auto">
            <h2 className="text-center bg-gray-800 text-white p-2 font-semibold tracking-wide text-sm">
                Prévisualisation
            </h2>
            <div
                className="flex-1 p-6 overflow-y-auto bg-white
                   prose prose-sm sm:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
            />
        </div>
    );
}

export default PreviewPane;