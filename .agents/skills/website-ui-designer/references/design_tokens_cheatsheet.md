# Design Tokens & Palette Cheatsheet

This cheatsheet provides curated, battle-tested design tokens, color harmonies, font pairings, and CSS variables for high-end web experiences.

---

## 1. Curated Color Palettes by Industry & Vibe

### Palette A: "Midnight Tactical & Obsidian Glow" (Ideal for Gun Ranges, Outdoor, High-Tech, Defense)
*A sleek, authoritative dark mode with tactical warmth and high-energy alert highlights.*

```css
:root {
  /* Backgrounds & Surfaces */
  --bg-primary: #0b0d10;          /* Deep obsidian abyss */
  --bg-surface: #14181f;          /* Elevated card surface */
  --bg-surface-hover: #1c222c;    /* Interactive card hover */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(234, 88, 12, 0.4);

  /* Brand Accents */
  --brand-primary: #f97316;       /* Radiant blaze orange */
  --brand-primary-hover: #ea580c;
  --brand-glow: rgba(249, 115, 22, 0.25);
  --brand-secondary: #22c55e;     /* Safety / Success green */
  --brand-metallic: #94a3b8;      /* Gunmetal slate */

  /* Typography */
  --text-primary: #f8fafc;        /* High-contrast crisp off-white */
  --text-secondary: #94a3b8;      /* Readable muted cool gray */
  --text-muted: #64748b;          /* Subtle metadata */
}
```

---

### Palette B: "Neo Cyber & Deep Indigo" (Ideal for SaaS, Dev Tools, AI Platforms)
*Cutting-edge tech aesthetic with deep space backgrounds and vivid neon gradients.*

```css
:root {
  --bg-primary: #0a0b14;
  --bg-surface: rgba(255, 255, 255, 0.03);
  --bg-surface-elevated: #121424;
  --border-subtle: rgba(255, 255, 255, 0.07);

  /* Accents */
  --brand-primary: #6366f1;       /* Indigo electric */
  --brand-secondary: #06b6d4;     /* Cyan laser */
  --brand-gradient: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  --brand-glow: rgba(99, 102, 241, 0.35);

  /* Typography */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
}
```

---

### Palette C: "Warm Nordic Minimalist" (Ideal for Lifestyle, Architecture, Wellness, Boutique)
*Organic, calming, sophisticated light mode with warm earthy undertones.*

```css
:root {
  --bg-primary: #faf8f5;          /* Warm porcelain alabaster */
  --bg-surface: #ffffff;          /* Pure crisp white card */
  --bg-surface-warm: #f3ede4;     /* Sandstone accent area */
  --border-subtle: rgba(0, 0, 0, 0.06);

  /* Accents */
  --brand-primary: #8b5e34;       /* Warm terracotta / tobacco */
  --brand-primary-hover: #6e4726;
  --brand-accent: #2d5a43;        /* Forest pine */

  /* Typography */
  --text-primary: #1c1917;        /* Deep espresso charcoal */
  --text-secondary: #57534e;      /* Warm slate */
  --text-muted: #a8a29e;
}
```

---

## 2. High-Impact Typography Pairings

### Pairing 1: Modern Tech & High Precision (Geometric + Clean)
- **Headings**: `Outfit`, `Cabinet Grotesk`, or `Syne`
- **Body**: `Inter`, `Plus Jakarta Sans`, or `Geist`
- **Google Fonts Import**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

h1, h2, h3, .heading-display {
  font-family: var(--font-display);
  letter-spacing: -0.03em;
  font-weight: 700;
  line-height: 1.15;
}

body, p, input, button {
  font-family: var(--font-body);
  letter-spacing: -0.01em;
  line-height: 1.6;
}
```

---

### Pairing 2: Authority, Craft & Heritage (Editorial Serif + Neutral Sans)
- **Headings**: `Playfair Display`, `Cinzel`, or `Fraunces`
- **Body**: `Plus Jakarta Sans` or `Work Sans`
- **Google Fonts Import**:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 3. Elevation, Radius & Shadow Tokens

```css
:root {
  /* Radius Tokens */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Layered Shadows (Dark Mode) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 24px var(--brand-glow);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
```
