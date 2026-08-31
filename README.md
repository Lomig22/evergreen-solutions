# Green Solutions — site vitrine

Site statique multilingue (7 langues) : HTML + CSS moderne + JavaScript vanilla.
**Zéro framework, zéro CDN, zéro dépendance npm en production.** Le dossier `dist/`
se dépose tel quel sur n’importe quel hébergement (Vercel, Netlify, Apache, nginx…).

## Lancer

```bash
node build.js               # génère dist/ (toutes les langues présentes dans src/i18n/)
node build.js --langs=fr,en # limite aux langues indiquées
npm run dev                 # build + serveur local http://localhost:8080 + rebuild à chaque modification
SITE_URL=https://exemple.com node build.js   # URL absolue (canonical, hreflang, sitemap, OG)
```

Node ≥ 18. Sur Vercel : framework **Other**, build `node build.js`, output `dist`
(déjà configuré par `vercel.json`, avec les en-têtes de cache).

## Structure

```
brief/            Documents sources du client (hors dépôt git — trop volumineux)
src/
  site.json       Langues, pages, ordre des fichiers CSS/JS
  templates/      Une page = un template ({{clé}}, {{#each}}, {{#if}}, {{> partial}}, {{url '/x/'}})
  partials/       header, footer, cta, familles, système, sélecteur de langue, sprite d’icônes…
  i18n/           fr.json (source), en.json, es.json, pt.json, de.json, it.json, ar.json
  data/           Données partagées entre langues (partners.json)
  css/ js/        Concaténés et hachés au build (site.<hash>.css / .js)
  assets/         fonts (WOFF2 sous-ensembles), img, video ; img/_src = originaux extraits, non publiés
tools/            make-images.py (variantes responsives), shots.js (captures Puppeteer)
build.js          Générateur statique, zéro dépendance
```

## Ajouter une langue

1. Copier `src/i18n/fr.json` vers `src/i18n/xx.json` et traduire les valeurs
   (jamais les clés, jamais les noms de produits EVERGREEN®, ECOFERT®…).
2. Déclarer la langue dans `src/site.json` → `langs` (code, nom natif, `dir`, locale).
3. `node build.js`. Toute clé manquante retombe sur le français avec un
   avertissement en console — le build ne casse jamais pour une traduction absente.

Le sélecteur de langue conserve la page courante (`/solutions/ecofert/` ⇄
`/de/solutions/ecofert/`). L’arabe est généré avec `dir="rtl"` ; les ajustements
spécifiques vivent dans `src/assets/css/rtl.css`, la police IBM Plex Sans Arabic
n’est chargée que sur `/ar/`.

## Ajouter une page

1. Créer `src/templates/ma-page.html`.
2. La déclarer dans `src/site.json` → `pages` (id, path, template).
3. Ajouter `pages.maPage.title` / `.description` (et ses textes) dans chaque `i18n/*.json`.

## Brancher le formulaire de contact

Le formulaire (`src/templates/contact.html`) pointe vers un endpoint **Formspree
en placeholder** : `https://formspree.io/f/FORM_ID_A_REMPLACER`. Créer un
formulaire sur formspree.io et remplacer `FORM_ID_A_REMPLACER` par le vrai
identifiant. Tant que le placeholder est en place, l’envoi est simulé côté
client (message de confirmation sans transmission) pour les démonstrations.

## Images & vidéos

- `tools/make-images.py SRC OUT --widths 1400,800 --aspect 16:10 …` génère les
  variantes JPEG + WebP (voir l’en-tête du script pour les options de recadrage
  et d’étalonnage).
- Vidéos encodées en H.264 (`-crf 25/26 -preset slow -an`, faststart), posters WebP,
  `preload="none"`, lecture automatique uniquement à l’écran et jamais en
  `prefers-reduced-motion`.

## Crédits photos

Photos du client : brochures et documents Green Solutions (extraits de `brief/`).
Photos de banque (licence Pexels — usage commercial libre, sans attribution
requise ; créditées par courtoisie) :

| Usage | Photographe | Source |
|---|---|---|
| Hero — terre craquelée | Kiptoo Addi | pexels.com/photo/14924252 |
| Hero — champ irrigué | Collab Media | pexels.com/photo/15060612 |
| Solution Eau & sols (mains + goutte-à-goutte) | Alfo Medeiros | pexels.com/photo/11573790 |

Fontes (SIL Open Font License, licences dans `src/assets/fonts/LICENSES/`) :
Bricolage Grotesque, Source Sans 3, IBM Plex Sans Arabic.

## Reste côté client

- Endpoint Formspree réel + mentions légales complètes (forme juridique,
  hébergeur, politique de confidentialité).
- Visuels HD : logo vectoriel, portraits de l’équipe, globe, photos de terrain.
- Validation des chiffres signalés dans `DESIGN.md` §9 (eau du Paulownia,
  fourchettes d’économie d’eau, matière organique des sols…).
