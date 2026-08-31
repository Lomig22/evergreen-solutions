# DESIGN.md — Green Solutions, site vitrine 2026

> Plan de design validé avant la première ligne de code de l'accueil.
> Tout chiffre cité provient des documents du `brief/` (référence page entre crochets).

---

## 0. Ce que l'inventaire a révélé

### Ancienne maquette (ecominvest-agency.com/previews/green-solutions/)
- Arborescence : 5 pages × 7 dossiers de langue (`/`, `/en/`, `/es/`, `/pt/`, `/ar/`, `/de/`, `/it/`). **On garde ce principe.**
- Hero texte sur fond uni (« Faire grandir le végétal. Préserver ses ressources. »), pas de vidéo en réalité, pas une seule donnée chiffrée sur tout le site, pas de carte, pas d'équipe, pas de partenaires, formulaire qui prépare un mailto.
- Ton : « Planter commence par vérifier », « Un document vaut par sa portée » — c'est un site qui doute à la place du client. **On prend l'inverse : le client vend des résultats, on les montre.**
- On ne recopie ni texte ni code (règle non négociable) ; seul le vert `#173C29` et l'arborescence sont conservés.

### Assets clients exploitables (qualité réelle mesurée)

| Asset | Source | Taille | Verdict |
|---|---|---|---|
| Logo couleur **avec transparence** | Paulownia PDF p1 (img 3 + smask 4) | 1200×574 | ✅ Utilisable partout (header, footer, OG). Nettoyage du fond, export PNG+WebP @1x/@2x |
| Logo sur fond blanc | Napema PDF p1 img 3 | 1200×574 | ✅ Secours |
| Wordmark NAPEMA® | Napema PDF p1 img 4 | 511×130 | ✅ Page Napema |
| Certifications SOHISCERT + EU Bio ES-ECO-002-AN | Ecofert PDF p3 img 12 | 516×309 | ✅ À découper en 2 logos, page Ecofert + Résultats |
| Globe drapeaux | Organigramme JPEG (≈160 px), visuels 12_44_51 / 12_48_35 | ≤160 px | ⚠️ Trop petit pour autre chose qu'une vignette. À redemander en HD |
| Portraits équipe (4 + 14) | Organigramme JPEG 1600×900 | ≈90 px de diamètre chacun | ⚠️ Recadrables (détection de cercles OpenCV), mais flous au-delà de 80 px affichés. À redemander en HD |
| Split terre/champ | JPEG 12_44_51 (×3) | 720×460 max, texte incrusté sur deux d'entre eux | ❌ Inutilisable en plein écran → recomposition (voir §5) |
| Robinet « 50 % minimum » | JPEG 12_48_35 | 1059×588 | ✅ Page Evergreen (recadré sans le texte) |
| Paulownia **1 an / 6 ans** (photos réelles, personne à l'échelle) | Paulownia V2 p1 img 16 | 800×375 | ✅ Or pur pour la page Paulownia et Résultats. Basse déf : affichage ≤ 400 px de large par photo |
| Paulownia par âge (1→7 ans, bande 5 photos) | Paulownia PDF p10 img 33 | 945×284 | ✅ Frise de croissance |
| Allée de plantation adulte | Paulownia PDF p16 img 49 / V2 img 13 | 962×540 | ✅ Focus Paulownia accueil |
| Plantation vue aérienne | Paulownia PDF p13 / V2 img 10 | ≈550×360 | ⚠️ Petit, usage vignette |
| Grumes / planches | Paulownia PDF p15 img 45-46 | 539×405 | ✅ Débouchés |
| Incendie de Tarascon 2022 | Paulownia PDF p12 img 36 | 998×749 | ✅ Preuve barrière anti-feu |
| Pépinière de plants en godets | Paulownia PDF p19 img 56 / V2 img 4 | 624×758 | ✅ Conditions de livraison |
| Plantation Paulownia en rangs | Synthèse PDF p4 img 12 | 1359×807 | ✅ Meilleure photo grand format du lot |
| Hydrogel dans la main / granulés | Evergreen PDF p4 img 12, p21 | 952×351 | ✅ « Comment ça marche » |
| Champ « Avec Evergreen® vs Sans » | Evergreen PDF p19 | 1068×718 | ✅ Résultats (avant/après) |
| Racines + gel, plant transplanté | Evergreen PDF p1 img 3, p20-22 | 1095×1138 | ✅ Mécanisme racinaire |
| Terre craquelée / maïs au soleil | Evergreen PDF p6 img 22-23 | 820×558 | ✅ Section Problème (pas assez grand pour le hero) |
| Insectes auxiliaires (ver, abeille, coccinelle) | Napema PDF p5 img 14-16 | 1000×1000 | ✅ Biodiversité Napema |
| Dispositif Water Vital sur fond blanc | Synthèse PDF p5 img 17 + vidéo 21_24_47 (≈0'48) | 1056×992 | ✅ Page Water Vital |
| Pivot d'irrigation | Synthèse PDF p5 img 16 | 1200×627 | ✅ Water Vital |
| 30 logos partenaires | PDF Partenaires (page vectorielle, pas d'images embarquées) | — | ✅ `pdftoppm -r 300` puis découpe par grille + détourage des fonds blancs |

Beaucoup de visuels des brochures sont des rendus IA (labo, cellules, plants parfaits). **Priorité aux photos réelles** (Paulownia, granulés, terrain), les rendus IA ne servent qu'en vignette de secours.

### Vidéos

| Fichier | Mesuré | Décision |
|---|---|---|
| `…21_24_47.mp4` diaporama Water Vital | 1920×1080, 30 fps, 2'03, 6,7 Mb/s, audio | Source de **captures** (dispositif, pivot, filière élevage). Pas de boucle : c'est un diaporama à texte incrusté |
| `…12_47_03.mp4` explainer 300× (NotebookLM) | 848×480, 5'49 | Non intégré. Confirme le schéma « polyacrylate de potassium ≠ polyacrylamide » et la synergie des 4 produits → réutilisé dans le schéma SVG |
| `…12_47_12.mp4` reportage TV | 1920×1080, 2'45 | **Non intégré** (droits) |
| `…12_47_12__1_.mp4` bécher hydrogel | 848×480, 51 s | Boucle 9 s (gonflement 0'12→0'21), upscale ×1,25 → 1060×600, `-crf 26 -an`, poster WebP. Page Evergreen |
| `…12_47_12__2_.mp4` bidon Ecofert | 478×850 portrait, 8 s, watermark « Veo » en bas à droite | Boucle portrait dans la colonne droite du hero Ecofert, recadrée à 478×780 pour retirer le watermark. Trop petite pour un plein écran |
| `…12_47_13.mp4` Water Vital 3D | 1080×1920 portrait, 83 s, 10 Mb/s | Boucle 10 s (coupe interne, ≈0'24→0'34) en 720×1280, colonne portrait page Water Vital |

Outils disponibles sur la machine : `ffmpeg`, `cwebp`, `pdfimages/pdftoppm`, Python + Pillow + OpenCV, Chrome 151 headless (captures). Fontes : téléchargement direct depuis le dépôt `google/fonts` (OFL) vérifié OK ; `fonttools`+`brotli` à installer pour le subsetting WOFF2.

---

## 1. Concept : « La ligne »

Le sujet de Green Solutions tient en une image que le client utilise déjà lui-même : **d'un côté la terre craquelée, de l'autre le champ irrigué, et une ligne entre les deux.** Cette ligne est la signature du site.

- Elle est **le hero** de l'accueil (comparateur interactif, §5).
- Elle revient **une seule fois** par page produit, sous forme de comparateur avant/après réel quand le client en fournit un (Avec/Sans Evergreen, Paulownia 1 an/6 ans), jamais comme décoration.
- Elle structure la **narration chromatique de l'accueil** : sable/ocre pour le problème → papier végétal pour les solutions → vert forêt pour le système et l'appel à l'action. On entre dans le site par la sécheresse et on en sort par la forêt.

Tout le reste est discipliné : grille calme, photos larges, chiffres énormes, texte court.

---

## 2. Tokens

### 2.1 Couleurs

```css
:root {
  /* ancrage */
  --forest-900: #0E1F16;   /* texte courant, "noir vert" */
  --forest:     #173C29;   /* fonds forts, footer, titres */
  --forest-600: #1F4F36;   /* hover des surfaces forêt */
  --leaf:       #2E8B4A;   /* accent, icônes, bordures actives, GRANDS chiffres (≥24px) */
  --leaf-bright:#5DBE5F;   /* bouton primaire sur fond sombre, chiffres sur fond forêt */
  --leaf-100:   #DDEFDF;   /* fond doux des puces/chips */
  /* eau */
  --water:      #1F5FA8;   /* liens, données "eau" uniquement */
  --water-100:  #DCE8F7;
  /* problème / chaleur */
  --earth:      #B8732E;   /* données "problème", icônes de la section défis (≥24px) */
  --earth-700:  #8A5320;   /* texte petit sur sable */
  --sand:       #E9DCC3;   /* fond de la section Problème */
  --sand-100:   #F4EDE0;
  /* page */
  --paper:      #F6F8F3;   /* fond de page */
  --white:      #FFFFFF;
  --ink:        var(--forest-900);
  --ink-muted:  #46584E;   /* texte secondaire, légendes (AA sur papier : 6,6:1) */
  --line:       rgba(23, 60, 41, .14);
}
```

Contrastes vérifiés (WCAG) :
| Paire | Ratio | Usage autorisé |
|---|---|---|
| forest-900 / paper | 15,9 | texte |
| forest / paper | 11,3 | texte, titres |
| ink-muted / paper | 6,6 | texte secondaire |
| water / paper | 5,9 | liens (texte) |
| leaf / paper | 3,96 | **grands chiffres, icônes, bordures seulement** (pas de texte < 24 px) |
| earth / sand | 3,1 | grands chiffres, icônes ; texte petit → earth-700 (5,4) |
| leaf-bright / forest | 5,3 | texte et chiffres sur fond forêt |
| white / forest | 13,6 | texte sur fond forêt |
| forest-900 / leaf-bright | 7,1 | libellé du bouton primaire sombre |

Interdits : dégradés multicolores, fond noir, vert acide sur noir, crème/terracotta hors des rôles ci-dessus.

### 2.2 Typographie — deux familles, chargées localement

| Rôle | Fonte | Pourquoi |
|---|---|---|
| Display : titres, grands chiffres, nav | **Bricolage Grotesque** (variable `opsz,wdth,wght`, OFL) | Grotesk large à forte personnalité (a, g, ink traps), assume « 300× » et « 80 K€/ha » à 120 px, reste net en deux lignes. Axe optique : les titres à ≥ 48 px prennent l'opsz 96 (dessin plus contrasté), les petites tailles restent sobres |
| Texte, UI, formulaire | **Source Sans 3** (variable `wght`, OFL) | Humaniste, très lisible à 17 px, couverture latin étendu (PT, DE, IT, ES, FR) |
| Arabe uniquement | **IBM Plex Sans Arabic** Regular + Bold (OFL) | Chargée seulement sur `/ar/`, dessin moderne cohérent avec le grotesk ; les chiffres restent en chiffres occidentaux (usage courant en B2B agricole Golfe/Maghreb — à valider avec le client) |

Sous-ensembles WOFF2 (latin + latin-ext, graisses 500-800 display / 400-700 texte), `font-display: swap` + `<link rel=preload>`, fallbacks métriques (`size-adjust`) pour éviter le saut de mise en page.

Échelle fluide :
```css
--fs-display: clamp(3rem, 9vw, 7rem);       /* hero, chiffres héros — lh 0.95, ls -0.02em */
--fs-h1:      clamp(2.5rem, 5.5vw, 4.5rem);  /* lh 1.0 */
--fs-h2:      clamp(2rem, 3.8vw, 3.25rem);   /* lh 1.05 */
--fs-h3:      clamp(1.375rem, 2vw, 1.75rem); /* lh 1.2 */
--fs-lead:    clamp(1.125rem, 1.4vw, 1.375rem); /* lh 1.45 */
--fs-body:    1.0625rem;                     /* 17px, lh 1.6 */
--fs-small:   0.9375rem;                     /* légendes, footer */
```
Règles : jamais un seul mot coloré dans un titre ; pas de capitales espacées ; `hyphens: auto` + `overflow-wrap: anywhere` sur les titres (mots allemands) ; `font-variant-numeric: tabular-nums` sur les compteurs.

### 2.3 Espacements, grille, formes

```css
--space-1: .25rem; --space-2: .5rem; --space-3: .75rem; --space-4: 1rem;
--space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem; --space-16: 4rem;
--section: clamp(4rem, 9vw, 8rem);        /* padding vertical des sections */
--gutter:  clamp(1.25rem, 4vw, 3rem);     /* marge latérale */
--container: 80rem;                       /* 1280px : texte et grilles */
--container-wide: 96rem;                  /* 1536px : rangées photo */
--radius-s: 4px; --radius: 12px; --radius-l: 20px;
--shadow: none;                           /* pas d'ombres portées : on sépare par la couleur et 1px de trait */
```
Breakpoints : 360 (min testé), 640, 900, 1200, 1536. Mobile-first.

### 2.4 Mouvement

```css
--ease: cubic-bezier(.2, .7, .2, 1);
--t-ui: 160ms;      /* hover, focus */
--t-panel: 320ms;   /* accordéon, méga-menu, menu mobile */
--t-hero-sweep: 3000ms; --t-hero-title: 600ms;
```
Un seul moment orchestré : le hero. Ailleurs, uniquement des réponses à une action + deux réactions au scroll (compteurs qui montent, schéma du système qui se trace), chacune **une seule fois**. `prefers-reduced-motion: reduce` → hero figé à 50 %, compteurs affichés à leur valeur finale, schéma tracé d'emblée, marquee de logos remplacé par une grille.

### 2.5 Iconographie

Icônes inline SVG, grille 24, trait 1,5 px, `stroke: currentColor`, coins arrondis, **une seule famille dessinée pour le site** (goutte, racine, feuille, bouclier, molécule d'eau, arbre, sac de graines, globe, thermomètre, flamme, pièce/€, cadenas de garantie). Aucune icône remplie, aucune illustration 3D.

---

## 3. Composants

| Composant | Spécification |
|---|---|
| **Bouton primaire** | Sur fond clair : fond `forest`, texte blanc. Sur fond forêt/photo : fond `leaf-bright`, texte `forest-900`. Radius 6 px, padding 14/24, Source Sans 600, hover : fond `forest-600` / `#6FCB71` + translation 0 (pas de saut), focus : anneau 3 px `water` décalé 2 px |
| **Bouton secondaire** | Trait 1,5 px courant, fond transparent, mêmes dimensions |
| **Lien texte** | `water`, soulignement 1 px décalé 3 px, épaissi au hover. Pas de flèche collée |
| **Carte solution (accueil)** | Rangée pleine largeur : photo 58 % (ratio 16:10, `object-fit: cover`, zoom 1.03 au hover en 320 ms) + colonne texte : nom du produit en display, promesse en une phrase, chiffre héros + légende, lien « Voir la solution ». Séparées par 1 px `line`, pas d'ombre |
| **Compteur** | Display 500, `tabular-nums`, préfixe/suffixe en `h3`, légende `small` `ink-muted`. Monte en 1,2 s (easing out) à l'entrée dans le viewport, une fois. Sans JS : valeur finale en dur dans le HTML |
| **Barres de rendement** | Voir §6 |
| **Accordéon FAQ** | `<details>/<summary>` natifs (fonctionne sans JS), icône +/× qui tourne, contenu en `grid-template-rows` animé 320 ms, `name=` pour n'en ouvrir qu'un |
| **Header** | 72 px, fixe. Sur le hero : transparent, logo dans une tuile blanche arrondie (comme sur les visuels du client), liens blancs sur voile dégradé haut. Dès 40 px de scroll : fond `paper` à 96 %, `backdrop-filter`, trait bas 1 px. Entrées : Solutions (méga-menu 5 familles, 2 colonnes : famille + phrase + chiffre), Paulownia, Résultats, L'entreprise, Contact, sélecteur de langue (`<details>` natif, noms de langue en langue native), CTA |
| **Menu mobile** | Plein écran fond `forest`, entrées en display 2 rem, sous-liste Solutions dépliée, langues en bas, fermeture Échap + focus trap |
| **Sélecteur de langue** | Conserve le chemin courant : `/solutions/ecofert/` ↔ `/de/solutions/ecofert/`. `hreflang` correspondants dans le `<head>` |
| **Footer** | Fond `forest`, 4 colonnes : identité + signature « Innovate · Sustain · Transform », plan du site, solutions, coordonnées (adresse, tél. cliquable, 2 emails). Ligne basse : RCS 420 728 545 00021, mentions légales, langues, © |
| **Formulaire 2 étapes** | Étape 1 « Votre projet » : culture/usage, pays (datalist), surface (+ unité ha), problème principal (radio : eau, sol, rendement, ravageurs, reboisement), solution qui vous intéresse (cases). Étape 2 « Vous » : nom, organisation, email, téléphone, message libre. Barre de progression 2 crans (vraie séquence → numéros autorisés), validation native + messages, confirmation inline. `action` Formspree en placeholder |

---

## 4. Wireframes

### 4.1 Accueil (1440 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│[▣ GREEN SOLUTIONS]  Solutions▾  Paulownia  Résultats  L'entreprise  Contact  FR▾ [Présenter mon projet]│ ← transparent
├──────────────────────────────────────────────────────────────────────────────┤
│                                     ║                                        │
│   TERRE CRAQUELÉE (ocre, sec)       ║   CHAMP IRRIGUÉ (vert, frais)          │  100svh
│                                     ║                                        │  min 600px
│   Vous avez                         ║   Nous avons                           │  display 800
│   un problème.                      ║   la solution.                         │
│                                   ◁ ● ▷                                      │  poignée
│   Jusqu'à 70 % d'eau économisée, des sols qui revivent, des rendements       │  lead
│   qui changent d'échelle. Depuis Le Pradet, dans 60 pays.                    │
│   [Présenter mon projet]   [Découvrir les solutions]                         │
│                                                            ↓ défiler         │
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│   300×          50-70 %        4 flacons        3 m           60 pays        │  compteurs
│   son poids     d'eau          suffisent        de croissance  utilisent     │  display 500
│   en eau        d'irrigation   pour 1 ha        par an         ECOFERT®      │  + légende
│   stockée       en moins       (ECOFERT®)       (Paulownia)                  │
├──────────────────────────────────────────────────────────────────────────────┤  fond SAND
│   Quatre problèmes. Les mêmes partout dans le monde.                         │  h2
│   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│   │ ◌ goutte   │ │ ◌ racine   │ │ ◌ €        │ │ ◌ épi      │                │  icônes earth
│   │ L'eau      │ │ Le sol     │ │ La marge   │ │ L'assiette │                │  h3
│   │ 1 kg de    │ │ Jusqu'à    │ │ Les rende- │ │ 800 M de   │                │  1 fait chiffré
│   │ céréales = │ │ 85 % des   │ │ ments chu- │ │ personnes  │                │  du brief
│   │ 1 000 L    │ │ engrais    │ │ tent, les  │ │ ont faim   │                │
│   │ d'eau      │ │ lessivés   │ │ coûts non  │ │ chaque jour│                │
│   └────────────┘ └────────────┘ └────────────┘ └────────────┘                │
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│   Cinq réponses. Un seul fournisseur.                                        │  h2
│   ┌───────────────────────────────┬──────────────────────────────┐           │
│   │ PHOTO granulés/gel dans main  │ EVERGREEN® & ECOSORB®         │           │  rangée 1
│   │                               │ L'eau reste là où sont les   │           │
│   │                               │ racines.                     │           │
│   │                               │ 300×  son poids en eau       │           │
│   │                               │ Voir la solution             │           │
│   ├───────────────────────────────┼──────────────────────────────┤           │
│   │ PHOTO champ / bidon           │ ECOFERT®   4 flacons = 1 ha  │           │  rangée 2
│   ├───────────────────────────────┼──────────────────────────────┤           │
│   │ PHOTO coccinelle / feuille    │ NAPEMA®    0 résidu toxique  │           │  rangée 3
│   ├───────────────────────────────┼──────────────────────────────┤           │
│   │ PHOTO dispositif / pivot      │ WATER VITAL®  −30 % d'eau    │           │  rangée 4
│   ├───────────────────────────────┼──────────────────────────────┤           │
│   │ PHOTO forêt 6 ans             │ PAULOWNIA ALTIFOLIA®  3 m/an │           │  rangée 5
│   └───────────────────────────────┴──────────────────────────────┘           │
├──────────────────────────────────────────────────────────────────────────────┤  fond FOREST
│   Un seul système, de l'eau à la récolte.                                    │  h2 blanc
│                                                                              │
│   (○ EVERGREEN®)──────(○ ECOFERT®)──────(○ NAPEMA®)──────(○ WATER VITAL®)──────(○ PAULOWNIA)│  schéma SVG
│    retient l'eau        nourrit           protège         optimise l'eau       valorise    │  tracé au scroll
│    dans le sol          la plante         sans résidu     d'irrigation         la terre    │
│                                                                              │
│   « Chaque plant de Paulownia part avec sa dose d'EVERGREEN® et d'ECOFERT®. » │
├──────────────────────────────────────────────────────────────────────────────┤  photo pleine largeur
│   PHOTO plantation Paulownia (rangs, contre-jour)                             │  ratio 21:9
│   ┌──────────────────────────────────────────────┐                           │  panneau paper
│   │ Une forêt rentable en six ans.               │                           │  ancré en bas-gauche
│   │ 3 m/an   80 K€/ha   426 °C                   │                           │
│   │ [Le projet Paulownia]                        │                           │
│   └──────────────────────────────────────────────┘                           │
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│   Ils travaillent avec nous.          ⟵ logos défilants (30) ⟶              │  marquee
│   Institut Moreau-Daverne · Afrinest · UF/IFAS · Oregon State · Campari…     │
│   Des solutions déployées de la France à l'Afrique du Sud, du Brésil au Golfe.│
├──────────────────────────────────────────────────────────────────────────────┤  fond FOREST, 80svh
│                    Vous avez un problème.                                    │  display blanc
│                    Présentez-le-nous.                                        │
│        Réponse de Michel-Paul Correa sous 48 h · +33 (0)6 44 83 55 09        │
│                    [Présenter mon projet]                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ FOOTER forest : identité | plan du site | solutions | coordonnées / RCS / langues │
└──────────────────────────────────────────────────────────────────────────────┘
```

Mobile (390 px) : hero conserve la ligne verticale et le drag ; les deux moitiés du titre s'empilent centrées (« Vous avez un problème. » sur voile sable, « Nous avons la solution. » sur voile vert), boutons en pleine largeur. Compteurs en grille 2+2+1. Défis en 2 colonnes. Rangées solutions → photo au-dessus, texte dessous. Schéma système → vertical. Logos → deux lignes défilantes en sens inverse.

### 4.2 Page produit (gabarit commun aux 4 pages solution + Paulownia étendu)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER (fond paper dès le départ, pas de transparence hors accueil)          │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┬──────────────────────────────────────────┐ │
│ │ EVERGREEN® & ECOSORB®          │                                          │ │  hero 2 colonnes
│ │ Hydro-rétenteurs               │      PHOTO / VIDÉO produit               │ │  min 70svh
│ │                                │      (bécher, bidon, dispositif…)        │ │
│ │ L'eau reste là où sont         │                                          │ │
│ │ les racines.                   │                                          │ │
│ │                                │                                          │ │
│ │ 300×   son poids en eau        │                                          │ │  chiffre héros
│ │ [Présenter mon projet]         │                                          │ │
│ └───────────────────────────────┴──────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤  fond SAND
│  Le problème                                                                 │
│  Texte court (3-4 phrases) + 1 chiffre du problème (85 % des engrais lessivés)│
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│  Comment ça marche                                                           │
│  ┌──────────────────────────┐  1. Le grain sec absorbe 300 fois son poids    │  schéma SVG
│  │  SCHÉMA racine + gel     │  2. Le gel stocke l'eau dans la zone racinaire │  ou vidéo boucle
│  │  (ou vidéo bécher)       │  3. La plante puise selon ses besoins          │  (vraie séquence
│  └──────────────────────────┘  4. Le gel se dégrade en C, H₂O, O₂, K         │   → numéros OK)
├──────────────────────────────────────────────────────────────────────────────┤
│  Ce que ça change                     grille 3×2                             │
│  ◌ −50 à −70 % d'eau   ◌ −50 à −80 % de fréquence   ◌ +95 % de reprise      │  chiffre + phrase
│  ◌ Engrais retenus     ◌ Sol décompacté             ◌ 2-3 ans d'effet        │
├──────────────────────────────────────────────────────────────────────────────┤  fond forest
│  Où l'utiliser        chips : Grandes cultures · Bio · Pépinières · Golfs ·  │
│                        Arboriculture · Reboisement · Collectivités · Résidentiel│
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│  Preuves                                                                     │
│  [comparateur Avec / Sans Evergreen® — photo client]  ou  [logos certif.]    │  la "ligne", 1 fois
│  Tableau comparatif vs concurrents (acrylamide, sodium, écorces) → 5 colonnes│
├──────────────────────────────────────────────────────────────────────────────┤
│  Questions fréquentes (accordéon, 5-6 questions tirées du PDF)               │
├──────────────────────────────────────────────────────────────────────────────┤  fond forest
│  CTA « Présenter mon projet » + rappel des 4 autres solutions (liens)        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Paulownia ajoute : frise de croissance an par an (photos réelles 1→7 ans, vraie séquence), bloc rentabilité (825 arbres/ha · 550 €/m³ · ~80 K€/ha · première coupe 3/6/8 ans), débouchés (bois, granulés 100-200 €/t, miel 400-700 kg/ha, crédits carbone), conditions de livraison en liste de contrôle, comparateur 1 an / 6 ans, preuve Tarascon 2022.

### 4.3 Page L'entreprise

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Depuis Le Pradet, pour les champs du monde entier.                          │  h1 + 2 phrases
│  Technologies disruptives pour une agriculture écologiquement intensive.    │
├──────────────────────────────────────────────────────────────────────────────┤
│  Notre façon de travailler        1. Votre terrain   2. Le protocole   3. Le suivi │  vraie séquence
│  (diagnostic → dosage précis fourni → accompagnement, cf. brochure Evergreen p22) │
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│  Direction                                                                   │
│  (◯) Michel-Paul   (◯) Jean-Michel   (◯) Gabriel   (◯) Franck                 │  4 portraits
│      CORREA            FOUCHER          BONNAT        PETAIN                 │  ronds 96px
│      CEO               Dir. technique   Dir. stratégie Dir. finances         │
├──────────────────────────────────────────────────────────────────────────────┤
│  Réseau d'experts et de référents        filtres : Sols & plantes · Agronomie · │
│  (◯)(◯)(◯)(◯)(◯)(◯)(◯)                    Environnement · Développement pays │  14 portraits 72px
│  (◯)(◯)(◯)(◯)(◯)(◯)(◯)                    nom + rôle + pays                  │
├──────────────────────────────────────────────────────────────────────────────┤  fond forest
│  Présence internationale                                                     │
│  ┌──────────────────────────────────────────────┐  France · Espagne · Italie │  carte monde SVG
│  │   carte monde simplifiée, points leaf-bright  │  Royaume-Uni · Canada · USA│  (Natural Earth,
│  │   sur les pays du réseau + partenaires        │  Brésil · Haïti/Caraïbes   │  domaine public)
│  └──────────────────────────────────────────────┘  Maroc · Tunisie · Égypte… │
├──────────────────────────────────────────────────────────────────────────────┤  fond paper
│  Partenaires  (mur de 30 logos, gris → couleur au hover, pays en légende)    │
├──────────────────────────────────────────────────────────────────────────────┤
│  Coordonnées + CTA                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Le hero — spécification

### Composition
- Deux photos plein écran superposées, **même ligne d'horizon (≈ 38 % de la hauteur), même heure de lumière (fin d'après-midi), même focale** : à gauche terre craquelée ocre, à droite champ irrigué vert avec rampe/goutte-à-goutte visible.
- Sources : les visuels split du client font 720 px de large → inutilisables. Recomposition à partir de deux photos libres de droits haute résolution (licence Unsplash/Pexels vérifiée, crédit dans le README), étalonnées l'une vers l'autre (ciel de même luminosité, ocre `#B8732E` et vert `#2E8B4A` dominants). Export : 2 × (2560 / 1600 / 960 px) WebP q78 + JPEG de secours, ≤ 400 Ko chacune en 2560.
- Un voile dégradé bas (forest-900 à 45 % → 0) assure la lisibilité de la promesse et des boutons quel que soit le point de coupe.

### Séquence d'ouverture (une seule fois par session)
1. t = 0 : l'écran entier est terre craquelée ; la ligne de partage est au bord droit. Le header est déjà là.
2. t = 0,3 → 3,3 s : la ligne traverse l'écran **de la droite vers le centre** (easing out), le champ irrigué la suit et « inonde » la moitié droite. La terre cède la place au champ.
3. t = 3,0 s : « Vous avez un problème. » apparaît sur la terre (gauche), puis à 3,4 s « Nous avons la solution. » sur le champ (droite) — fondu 600 ms + montée 12 px, c'est le seul fade-up du site.
4. t = 3,8 s : promesse + boutons + indice de défilement.
5. Après la séquence, la poignée est libre : glisser (pointer events), flèches ← → (pas de 2 %, Home/End), `role="slider"` avec `aria-valuenow`, `aria-label="Comparer terre sèche et champ irrigué"`.

> **Écart avec le brief, assumé.** Le brief demandait une ligne qui va « de gauche à droite ». Pour que le problème reste **à gauche** (lu en premier, comme dans la signature « Vous avez un problème. Nous avons la solution. » et sur les visuels du client) et que ce soit bien **la terre qui cède la place au champ**, la géométrie impose que la ligne arrive de la droite : le champ avance sur la terre. Si vous tenez au sens gauche → droite, on inverse les deux photos et les deux moitiés du titre en changeant une variable (`--hero-flip`). En arabe (RTL) la scène est miroir : terre à droite, champ à gauche, la ligne vient de la gauche.

### Dégradations
- **Sans JavaScript** : `--split: 50%` en CSS, image fixe partagée au milieu, titres visibles d'emblée. La page reste belle.
- **`prefers-reduced-motion`** : pas de balayage, pas de fondu ; la poignée reste manipulable.
- **Mobile** : même mécanique, titres empilés (voir §4.1), séquence raccourcie à 2 s, `100svh` pour éviter le saut de barre d'adresse.
- **Session** : `sessionStorage` mémorise que la séquence a été jouée → retour sur l'accueil = état final immédiat.

---

## 6. Dataviz — les rendements ECOFERT® (page produit + Résultats)

Le tableau brut du PDF [Ecofert p5] devient un bloc de barres horizontales appariées, une paire par culture, **valeur affichée en bout de barre**, multiplicateur en badge :

```
Blé          ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇  10 500 kg/ha        ×3,1
             ▇▇▇▇▇▇▇▇▇▇  3 400  (FAO 2022)
Maïs         ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇  22 000              ×3,7
             ▇▇▇▇▇▇▇▇  6 000
Tomate       ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇  215 000             ×5,7
             ▇▇▇▇▇  38 000
```
- Deux séries seulement : `forest` = avec ECOFERT®, `sand`/`earth` = moyenne mondiale. Échelle linéaire **par ligne** (la barre ECOFERT® fait toujours 100 % de la largeur) : c'est le rapport qui compte, et les cultures sont incomparables entre elles.
- Les fourchettes (olives 20-40 kg/arbre, café 700-2 000) : barre au maximum de la fourchette, libellé avec la fourchette, multiplicateur calculé sur le maximum (le plus prudent).
- Onglets « Céréales · Fruits & légumes · Arbres · Cultures de rente », 100 % HTML/CSS (barres = `div` avec `inline-size` en %), légende « chiffres communiqués par Green Solutions ; moyenne mondiale : FAO 2022 pour le blé, autres sources à préciser ».
- Matière organique du sol : seules les trois valeurs présentes dans le brief sont affichées (asperges ≈ 65 %, amandiers ≈ 48 %, maïs ≈ 24 %) ; les quatre autres cultures du graphique PDF sont listées sans valeur en attendant les chiffres exacts.

---

## 7. Architecture technique (décisions, le reste est dans le brief)

```
src/
  templates/            pages HTML avec {{clé}}, {{#each}}, {{> partial}}, {{url '/x/'}}
  partials/             head, header, footer, cta, mega-menu, lang-switcher
  i18n/fr.json … ar.json
  css/  tokens.css base.css components.css pages.css rtl.css
  js/   hero.js counters.js nav.js system.js form.js (modules ES, ~12 Ko total, sans dépendance)
  assets/ fonts/ img/ video/ icons.svg (sprite)
build.js                Node ≥ 18, zéro dépendance : rend 10 pages × 7 langues, hreflang, canonical,
                        OG, JSON-LD Organization + Product, sitemap.xml, robots.txt, copie des assets
dist/                   livrable
```
- Slugs identiques dans toutes les langues (`/de/solutions/ecofert/`), seul le préfixe change.
- Clé manquante → valeur FR + `console.warn('[i18n] de: clé manquante home.hero.title')`.
- Images : `<picture>` WebP + JPEG, `srcset` 3 tailles, `width/height` déclarés, `loading="lazy"` hors hero, `fetchpriority="high"` sur les deux photos du hero.
- Vidéos : `preload="none"`, `poster` WebP, `muted playsinline loop`, lecture au clic ou à l'entrée dans le viewport (bécher, Water Vital), jamais en autoplay sur `prefers-reduced-motion`.
- Budget : page d'accueil ≤ 1,2 Mo transférés au premier écran (hero 2 × 380 Ko + fontes 110 Ko + CSS/JS 40 Ko), Lighthouse mobile ≥ 95 sur les 4 axes.

---

## 8. Relecture : ce que j'ai retiré du premier jet, et pourquoi

Premier jet relu à la lumière du §3 du brief. Supprimé ou remplacé :

| Premier réflexe | Pourquoi c'était un défaut de génération | Remplacé par |
|---|---|---|
| Un « eyebrow » en capitales espacées au-dessus de chaque titre (« NOS SOLUTIONS », « LE SYSTÈME ») | Tic de template, n'apporte rien, interdit par le brief | Le titre porte le sens seul (« Cinq réponses. Un seul fournisseur. ») |
| « solution » en vert vif dans le titre du hero | Un mot coloré = surlignage artificiel ; ici la photo derrière chaque moitié fait déjà le contraste | Deux moitiés de titre, même blanc, portées par les photos |
| Grille de 5 cartes égales avec ombre et coin arrondi pour les solutions | La disposition par défaut de tous les sites ; les photos méritent de la largeur et 5 n'entre pas dans une grille de 3 | Rangées pleine largeur photo + texte, séparées par un trait |
| Numéros « 01 → 05 » devant les 5 solutions | Ce n'est pas une séquence, c'est un catalogue | Le nom du produit en display fait office de repère. Numéros conservés uniquement pour les vraies séquences : étapes du mécanisme, ans de croissance, 2 étapes du formulaire |
| Fade-in + slide-up sur chaque section au scroll | Motion décorative généralisée, fatigue l'œil, pénalise le CLS perçu | Une seule apparition orchestrée (hero) + deux réactions au scroll (compteurs, schéma), jouées une fois |
| Dégradé vert → bleu sur le CTA final | Signale « généré », dilue la palette | Aplat `forest`, texte blanc, bouton `leaf-bright` |
| Icônes de bibliothèque (Lucide/Feather) | Reconnaissables partout | Une famille de 12 icônes dessinée pour le site sur la même grille |
| Flèches « → » collées aux liens « Voir la solution → » | Interdit, et redondant avec le soulignement | Lien souligné, la flèche n'existe que dans la poignée du hero |
| Fond crème + terracotta « chaleureux » sur toute la page | Palette générique 2024, le brief l'interdit | Sable/ocre **réservés à la section Problème** ; le reste est papier végétal lumineux |
| Tableau HTML brut des rendements | Illisible sur mobile, ne montre pas l'écart | Barres appariées avec multiplicateur (§6) |
| Chiffres arrondis « pour faire propre » (ex. 100 K€/ha, 5× plus de CO₂) | Aucun chiffre ne doit être inventé ni arrondi | Chiffres exacts du brief, avec la source page, incohérences remontées au client (§9) |
| Ligne du hero de gauche à droite (lettre du brief) | Incompatible avec « problème à gauche » + « la terre cède au champ » | Ligne de droite vers le centre, inversion possible par variable (§5) |

---

## 9. À valider côté client (remonté dès maintenant)

1. **Besoin en eau du Paulownia** : le brief et la fiche V2 disent 5 L/jour (vs 25), la brochure longue dit 2 L/jour et 7 L en canicule [Paulownia p13], la synthèse dit 2-7 L [Synthèse p4]. Le site affichera « 5 L/jour en moyenne » (brief) tant que le client ne tranche pas.
2. **Économies d'eau Evergreen** : « 50 à 60 % » [Synthèse p3] vs « 50 à 70 % » [Evergreen p3, p9] → on affiche 50-70 % (brochure produit, plus récente) avec « au moins 50 % » en accroche.
3. **Exemple jardinière** : le brief dit « quelques litres par mois », la brochure « 50 litres tous les 3 mois » [Evergreen p11] → vérification à haute résolution, on affiche la version brochure.
4. **Rentabilité Paulownia** : 80 K€/ha [Synthèse p4] alors que le graphique de la brochure culmine à 240 000 € sans unité de surface [Paulownia p17] → on garde 80 K€/ha, le graphique n'est pas repris.
5. **Hauteur / cycle** : 13-15 m en « 5 à 6 ans » [Paulownia p2] vs « 6 à 8 ans » [V2] → on écrit « 13-15 m en 6 à 8 ans ».
6. **Matière organique du sol** : valeurs exactes pour cerisiers, oliviers, blé, poiriers.
7. **Email de contact** : `contact@evergreen-ecosorb.com` (organigramme, brief) vs `contact@greensolutions.com` (brochures) → le site utilise `contact@evergreen-ecosorb.com` + `mpcinternat@gmail.com`.
8. **Assets HD manquants** : logo vectoriel, globe drapeaux, portraits des 18 personnes, photos de terrain haute résolution (champs traités, irrigation, plantation Paulownia), logos partenaires en fichiers natifs.
9. **Endpoint du formulaire** (Formspree ou autre), **mentions légales** (SIREN/forme juridique/hébergeur), politique de confidentialité.
10. **Chiffres arabes** : chiffres occidentaux conservés sur la version AR (choix par défaut), à confirmer.

---

## 10. Ordre de fabrication

1. Squelette `src/` + `build.js` minimal (une page, FR) → tokens, base, header/footer.
2. Assets : fontes (subset WOFF2), logo, extraction PDF, photos hero, vidéos encodées, sprite d'icônes.
3. Accueil FR complet → captures 390 / 1440 → critique → corrections. **Gabarit de référence.**
4. Pages produit (×4), Paulownia, Résultats, Entreprise (portraits, carte, logos), Contact.
5. i18n : 6 traductions, RTL, captures AR + DE.
6. Passe finale : Lighthouse, validation HTML, liens, poids, README, rapport.
