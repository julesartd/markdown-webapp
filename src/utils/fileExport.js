export const exportAsFile = (content, filename, mimeType) => {
    if (content === undefined || content === null || !filename) {
        console.warn("Export annulé : contenu ou nom de fichier manquant.");
        return;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};