# Portfolio collage

Un portfolio statique construit autour des deux images fournies. Le héros occupe immédiatement tout le viewport, puis retire ses huit scènes périphériques au défilement pour révéler le portrait propre placé dessous. Les trois cases principales restent cliquables au sommet de la page.

## Lancer le site

```powershell
npm run dev
```

Ouvrir ensuite `http://127.0.0.1:4173`.

## Produire la version finale

```powershell
npm run build
```

La version publiable est générée dans `dist/`.

## Mettre à jour le contenu

Le contenu se trouve directement dans `index.html`. Les formations, les projets, les expériences, les compétences et les coordonnées ont été repris du portfolio historique de Mounir. Les trois entrées du collage pointent vers les sections suivantes :

- première case de la première ligne → Formations ;
- dernière case de la deuxième ligne → Projets ;
- première case de la troisième ligne → Expériences professionnelles.

Les couleurs et la mise en page générale sont regroupées dans `styles.css`. Le fond du site utilise la teinte papier médiane extraite du portrait (`#c9bcaf`). Les masques, les zones cliquables et la composition plein écran du héros sont dans `hero.css`. La progression de la révélation au scroll est gérée dans `app.js`.

## Régénérer les découpes

Le script `scripts/slice_hero.py` produit les fragments transparents dans `assets/fragments/` à partir du PNG original :

```powershell
python scripts/slice_hero.py "C:\chemin\vers\le-collage.png"
```

Pour ne régénérer qu’un fragment, utiliser par exemple `--only middle-left`.

Le script `scripts/prepare_portrait.py` crée les trois formats WebP responsives du portrait propre :

```powershell
python scripts/prepare_portrait.py "C:\chemin\vers\le-portrait.png"
```
