# Projet Markdown WebApp

## Membres du groupe

- Jules
- Kilian
- Zakaria
- Bastien

## Description

Cette application web permet de gérer et modifier des fichiers Markdown, d'organiser des dossiers, d'insérer et de prévisualiser des images, de créer et insérer des blocs Markdown réutilisables et d'utiliser une bibliothèque d'images locale. Elle est développée avec **React**, **Redux Toolkit**, **Vite** et **TailwindCSS**.

## Installation

1. **Cloner le dépôt :**

   ```sh
   git clone <url-du-repo>
   cd markdown-webapp
   ```

2. **Installer les dépendances :**

   ```sh
   npm install
   ```

3. **Lancer le serveur de développement :**

   ```sh
   npm run dev
   ```

4. **Accéder à l'application :**
   Ouvrir [http://localhost:5173](http://localhost:5173) dans un navigateur.

## Structure du projet

```
src/
  components/       // Composants React (explorateur, éditeur, modals, images...)
  features/         // Slices Redux pour fichiers et images
  hooks/            // Hooks personnalisés
  utils/            // Fonctions utilitaires (localStorage, export, images...)
  App.jsx           // Composant principal
  main.jsx          // Point d'entrée
  store.js          // Store Redux
public/             // Fichiers statiques
index.html          // Fichier HTML principal
```

## Prérequis

- Node.js
- npm

## Fonctionnalités principales

- Gestion de fichiers et dossiers Markdown
- Édition et prévisualisation Markdown en temps réel
- Création et insertion de blocs Markdown réutilisables
- Création de raccourcis clavier personnalisés pour insérer des blocs
- Insertion d'images depuis une bibliothèque locale
- Import/export de fichiers et d'images
- Drag & drop pour l'organisation des fichiers
