# Portfolio de Mounir DABIRE

Portfolio personnel présentant mon parcours, mes projets, mes expériences professionnelles et mes compétences en développement et intelligence artificielle.

Le projet utilise Astro et TypeScript pour répartir la page en composants maintenables tout en générant un site entièrement statique. L’identité visuelle existante reste portée par les mêmes feuilles de style, images, contenus et contrats DOM.

## Prérequis

- Node.js 24, version indiquée dans `.nvmrc` ;
- npm, installé avec Node.js.

Avec un gestionnaire de versions Node compatible avec `.nvmrc` :

```bash
nvm use
npm ci
```

## Commandes

```bash
npm run dev
npm run check
npm run build
npm run preview
```

- `npm run dev` lance le serveur de développement ;
- `npm run check` vérifie les composants Astro et les types TypeScript ;
- `npm run build` génère le site statique dans `dist/` ;
- `npm run preview` sert localement le contenu de `dist/` pour vérifier la version de production.

Le site est déployé dans le sous-chemin GitHub Pages `/PortFolio`. En développement, l’adresse locale par défaut est donc :

```text
http://localhost:4321/PortFolio/
```

## Architecture

```text
src/
  pages/        Pages et point d’assemblage du document
  layouts/      Structure HTML partagée et métadonnées
  components/   Composants réutilisables
  sections/     Grandes sections du portfolio
  scripts/      Interactions TypeScript : langue, hero, navigation et focus
  styles/       Système visuel global et composition du hero
public/
  assets/       Images et illustrations du portfolio
  CV/           CV français et anglais
```

`src/pages/index.astro` remplace l’ancien `index.html` monolithique. Astro produit ensuite le HTML statique dans `dist/`. Le workflow GitHub Pages installe les dépendances, exécute le build puis publie ce dossier.
