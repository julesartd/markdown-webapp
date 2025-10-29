import React from 'react';

function ExportButton({ onClick, icon, text, className, title }) {
    return (
        <button onClick={onClick} className={className || ''} title={title || ''}>
            {icon}
            {text}
        </button>
    );
}

export default ExportButton;