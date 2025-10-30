import { useState, useEffect } from 'react';

/**
 * Un champ de saisie qui détecte et enregistre un raccourci clavier.
 * @param {string} value - La valeur actuelle du raccourci (ex: "Ctrl+B")
 * @param {function} onChange - Callback (string) => void
 * @param {string} placeholder - Texte à afficher si vide
 */
export default function ShortcutInput({ value, onChange, placeholder = "Cliquer pour définir" }) {
    const [displayValue, setDisplayValue] = useState(value || "");
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if (!isRecording) {
            setDisplayValue(value || "");
        }
    }, [value, isRecording]);

    const handleKeyDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const key = e.key.toUpperCase();

        if (['CONTROL', 'ALT', 'SHIFT', 'META', 'DEAD'].includes(key)) {
            let parts = [];
            if (e.ctrlKey) parts.push("Ctrl");
            if (e.altKey) parts.push("Alt");
            if (e.metaKey) parts.push("Cmd");
            if (e.shiftKey) parts.push("Shift");
            setDisplayValue(parts.join(" + ") + " + ...");
            return;
        }

        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            setDisplayValue("Modificateur requis (Ctrl, Alt...)");
            setTimeout(() => {
                if (document.activeElement === e.target) {
                    setDisplayValue("En attente...");
                }
            }, 800);
            return;
        }

        let parts = [];
        if (e.ctrlKey) parts.push("Ctrl");
        if (e.altKey) parts.push("Alt");
        if (e.metaKey) parts.push("Cmd"); // Support pour Mac
        if (e.shiftKey) parts.push("Shift");
        parts.push(key);

        const shortcutString = parts.join("+");
        onChange(shortcutString);
        setDisplayValue(shortcutString);
        setIsRecording(false);
        e.target.blur();
    };

    const handleFocus = () => {
        setIsRecording(true);
        setDisplayValue(value ? `Actuel : ${value}. En attente...` : "En attente...");
    };

    const handleBlur = () => {
        setIsRecording(false);
        setDisplayValue(value || "");
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={isRecording ? displayValue : (value || "")}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={() => {}}
            autoComplete="off"
            className="px-3 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
    );
}