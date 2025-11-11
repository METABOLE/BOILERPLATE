# Altitude 101

Projet Next.js avec architecture modulaire et conventions strictes.

## 🚀 Démarrage

```bash
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## 📁 Architecture

### Composants
- **`features/`** : Composants spécifiques à chaque page
- **`components/ui/`** : Composants réutilisables (Button, Icons, etc.)
- **`components/layout/`** : Composants de mise en page (Header, Footer)
- **`components/shared/`** : Composants partagés entre features

### Hooks
- **`hooks/`** : Logique métier réutilisable (performance, scroll, animations, etc.)

### Layout
- **`layout/`** : Layouts spécifiques (default.tsx)

### Providers
- **`providers/`** : Contextes globaux
  - `performance.provider.tsx` : Gestion des performances
  - `smooth-scroll.provider.tsx` : Scroll fluide
  - `root.tsx` : Provider racine

## 🎨 Styles

### Tailwind CSS
- **Variables CSS** : `styles/tailwind.css`
- **Spacing global** : Variables `--x-default`, `--y-default` avec variantes (half, double)
- **Padding/Margin** : `padding-x-default`, `margin-y-double-default`, etc.
- **Couleurs et fonts** : Déclarées dans `:root` et `@theme`

### SCSS
- **`styles/abstracts/`** : Mixins et keyframes
- **`styles/base/`** : Reset, fonts, Lenis
- **`styles/components/`** : Typographie et composants
- **`styles/main.scss`** : Point d'entrée principal

### Conventions
- **Typographie** : Classes `.h1`, `.h2`, `.h3`, `.p1`, `.p2`, `.p3` dans `_typography.scss`
- **Fonts** : Déclaration des polices dans `_fonts.scss`
- **Variables globales** : SCSS pour la typographie, Tailwind pour le spacing
- **Mixins** : `_mixins.scss`
- **Animations** : `_keyframes.scss`

## ⚙️ Configuration

### ESLint + Prettier
```bash
yarn format    # Formater le code
yarn check     # Vérifier sans corriger
yarn lint      # Linter
```

### VS Code
- Formatage automatique avec ESLint
- Prettier pour l'ordre des propriétés CSS
- Husky pour les hooks Git

## 🛠️ Scripts

```bash
yarn dev       # Développement avec Turbopack
yarn build     # Build de production
yarn start     # Serveur de production
yarn format    # Formater avec ESLint
yarn check     # Vérifier le code
```

## 📦 Dépendances

- **Next.js 15** avec Pages Router
- **React 19** + TypeScript
- **Sanity v4** pour le CMS + Visual Editing
- **GSAP** pour les animations
- **Lenis** pour le scroll fluide
- **Tailwind CSS 4** + SCSS
- **ESLint** + Prettier pour le code quality

## 🎯 Sanity CMS

### Configuration

Les variables d'environnement nécessaires :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3000/studio
SANITY_VIEWER_TOKEN=your-token
```

### Studio Sanity

Accédez au studio à [http://localhost:3000/studio](http://localhost:3000/studio)

### Architecture de données

#### Services
- **`services/sanity.service.ts`** : Logique centralisée pour fetch et Visual Editing
  - `fetchSanityData()` : Récupère les données avec support du draft mode
  - `createDataAttribute()` : Génère les attributs click-to-edit

- **`services/[content].service.ts`** : Services par type de contenu (ex: `sample.service.ts`)
  - Contient les requêtes GROQ spécifiques
  - Utilise `fetchSanityData()` sous le capot

#### Hooks
- **`hooks/useSanityData.ts`** : Hook pour simplifier l'usage des données Sanity
  - Extrait `data` et `encodeDataAttribute` automatiquement
  - À utiliser dans vos composants

### Visual Editing

Le Visual Editing permet de modifier le contenu directement depuis l'aperçu.

#### Utilisation dans une page

```typescript
// pages/exemple.tsx
import { useSanityData } from "@/hooks/useSanityData";
import { fetchSamples } from "@/services/sample.service";
import type { InferGetStaticPropsType } from "next";

export const getStaticProps = async (context: { draftMode?: boolean }) => {
  const samples = await fetchSamples(context);
  
  return { 
    props: { 
      samples,
      draftMode: samples.draftMode // ✅ Important pour activer Visual Editing
    } 
  };
}

export default function Page({ samples }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data, encodeDataAttribute } = useSanityData(samples);

  return (
    <div>
      {data.map((item, index) => (
        <h1 
          key={item._id}
          data-sanity={encodeDataAttribute([index, 'name'])} // ✅ Click-to-edit
        >
          {item.name}
        </h1>
      ))}
    </div>
  );
}
```

#### Click-to-edit sur les champs

Pour un champ simple :
```typescript
data-sanity={encodeDataAttribute('title')}
```

Pour un champ dans un tableau :
```typescript
data-sanity={encodeDataAttribute([index, 'title'])}
```

Pour un champ imbriqué :
```typescript
data-sanity={encodeDataAttribute(['author', 'name'])}
```

#### Activation du Draft Mode

1. Allez dans le Studio : [http://localhost:3000/studio](http://localhost:3000/studio)
2. Ouvrez le **Presentation Tool**
3. Cliquez sur un élément avec `data-sanity` pour l'éditer
4. Les modifications sont visibles en temps réel

#### Désactivation

Cliquez sur "Disable Draft Mode" dans l'aperçu, ou allez sur `/api/disable-draft`
