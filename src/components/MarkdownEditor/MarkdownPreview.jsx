import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectImageLibrary } from '../../features/images/imageSelector';

/**
 * Prévisualisation Markdown avec rendu des images depuis la bibliothèque
 * @param {string} content - Contenu Markdown à prévisualiser
 */
export default function MarkdownPreview({ content }) {
  const [html, setHtml] = useState('');
  const imageLibrary = useSelector(selectImageLibrary);

  useEffect(() => {
    const renderMarkdown = async () => {
      // Configuration de marked
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      // Convertir le markdown en HTML
      let renderedHtml = await marked.parse(content || '');

      // Remplacer les références d'images par les données base64
      const imageRegex = /<img src="([^"]+)" alt="([^"]*)"[^>]*>/g;
      renderedHtml = renderedHtml.replace(imageRegex, (match, imageId, altText) => {
        // Si c'est une URL normale, la laisser telle quelle
        if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('data:')) {
          return match;
        }

        // Récupérer l'image depuis la bibliothèque Redux
        const image = imageLibrary[imageId];
        if (image && image.data) {
          return `<img src="${image.data}" alt="${altText}" class="max-w-full h-auto rounded-lg shadow-md my-4" />`;
        }

        // Si l'image n'existe pas, afficher un placeholder
        return `<div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 my-4 text-center text-gray-500">
          <p>Image introuvable: ${altText || imageId}</p>
        </div>`;
      });

      setHtml(renderedHtml);
    };

    renderMarkdown();
  }, [content, imageLibrary]);

  return (
    <div className="h-full overflow-y-auto px-4 py-3 bg-white">
      {content ? (
        <div
          className="prose prose-sm max-w-none markdown-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Aucun contenu à prévisualiser
        </div>
      )}
    </div>
  );
}
