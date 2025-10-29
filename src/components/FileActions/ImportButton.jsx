import { useRef } from 'react';

function ImportButton({ onFileImported, icon, text, className, title }) {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const name = file.name;
            onFileImported({ name, content });
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <>
            <button onClick={handleImportClick} className={className} title={title || ''}>
                {icon}
                {text}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".md,.markdown,text/markdown,text/plain"/>
        </>
    );
}

export default ImportButton;