# BOILERPLATE

A Next.js boilerplate with modular architecture and strict conventions.

## 🚀 Getting Started

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Architecture

### Components
- **`features/`**: Page-specific components
- **`components/ui/`**: Reusable components (Button, Icons, etc.)
- **`components/layout/`**: Layout components (Header, Footer)
- **`components/shared/`**: Components shared between features

### Hooks
- **`hooks/`**: Reusable business logic (performance, scroll, animations, etc.)

### Layout
- **`layout/`**: Specific layouts (default.tsx)

### Providers
- **`providers/`**: Global contexts
  - `performance.provider.tsx`: Performance management
  - `smooth-scroll.provider.tsx`: Smooth scroll
  - `root.tsx`: Root provider

## 🎨 Styles

### Tailwind CSS
- **CSS Variables**: `styles/tailwind.css`
- **Global Spacing**: Variables `--x-default`, `--y-default` with variants (half, double)
- **Padding/Margin**: `padding-x-default`, `margin-y-double-default`, etc.
- **Colors and fonts**: Declared in `:root` and `@theme`

### SCSS
- **`styles/abstracts/`**: Mixins and keyframes
- **`styles/base/`**: Reset, fonts, Lenis
- **`styles/components/`**: Typography and components
- **`styles/main.scss`**: Main entry point

### Conventions
- **Typography**: Classes `.h1`, `.h2`, `.h3`, `.p1`, `.p2`, `.p3` in `_typography.scss`
- **Fonts**: Font declarations in `_fonts.scss`
- **Global Variables**: SCSS for typography, Tailwind for spacing
- **Mixins**: `_mixins.scss`
- **Animations**: `_keyframes.scss`

## ⚙️ Configuration

### ESLint + Prettier
```bash
yarn format    # Format code
yarn check     # Check without fixing
yarn lint      # Linter
```

### VS Code
- Automatic formatting with ESLint
- Prettier for CSS property ordering
- Husky for Git hooks

## 🛠️ Scripts

```bash
yarn dev       # Development with Turbopack
yarn build     # Production build
yarn start     # Production server
yarn format    # Format with ESLint
yarn check     # Check code
```

## 📦 Dependencies

- **Next.js 15** with Pages Router
- **React 19** + TypeScript
- **Sanity v4** for CMS + Visual Editing
- **GSAP** for animations
- **Lenis** for smooth scroll
- **Tailwind CSS 4** + SCSS
- **ESLint** + Prettier for code quality

## 🎯 Sanity CMS

### Configuration

Required environment variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3000/studio
SANITY_VIEWER_TOKEN=your-token
```

### Sanity Studio

Access the studio at [http://localhost:3000/studio](http://localhost:3000/studio)

### Data Architecture

#### Services
- **`services/sanity.service.ts`**: Centralized logic for fetching and Visual Editing
  - `fetchSanityData()`: Fetches data with draft mode support
  - `createDataAttribute()`: Generates click-to-edit attributes

- **`services/[content].service.ts`**: Services per content type (e.g., `sample.service.ts`)
  - Contains specific GROQ queries
  - Uses `fetchSanityData()` under the hood

#### Hooks
- **`hooks/useSanityData.ts`**: Hook to simplify Sanity data usage
  - Automatically extracts `data` and `encodeDataAttribute`
  - To be used in your components

### Visual Editing

Visual Editing allows you to modify content directly from the preview.

#### Usage in a page

```typescript
// pages/example.tsx
import { useSanityData } from "@/hooks/useSanityData";
import { fetchSamples } from "@/services/sample.service";
import type { InferGetStaticPropsType } from "next";

export const getStaticProps = async (context: { draftMode?: boolean }) => {
  const samples = await fetchSamples(context);
  
  return { 
    props: { 
      samples,
      draftMode: samples.draftMode // ✅ Important to enable Visual Editing
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

#### Click-to-edit on fields

For a simple field:
```typescript
data-sanity={encodeDataAttribute('title')}
```

For a field in an array:
```typescript
data-sanity={encodeDataAttribute([index, 'title'])}
```

For a nested field:
```typescript
data-sanity={encodeDataAttribute(['author', 'name'])}
```

#### Activating Draft Mode

1. Go to the Studio: [http://localhost:3000/studio](http://localhost:3000/studio)
2. Open the **Presentation Tool**
3. Click on an element with `data-sanity` to edit it
4. Changes are visible in real-time

#### Deactivation

Click "Disable Draft Mode" in the preview, or go to `/api/disable-draft`
