# Modern UI Component Design Patterns

This guide provides battle-tested UI patterns for heroes, bento grids, glassmorphic cards, and interactive controls to instantly elevate website aesthetics.

---

## 1. The High-Converting Hero Section

### Anatomy of an Elite Hero
1. **Pill Announcement Badge**: "🔥 Introducing Tier 3 Precision Training • Learn More →"
2. **Impactful H1 with Gradient Accent**: Dynamic typography combining solid text with gradient highlights.
3. **Sub-headline**: Crisp, benefit-focused summary capped at 60 characters per line.
4. **Dual CTA Cluster**: Primary high-contrast button + Secondary subtle outline/ghost button.
5. **Social Proof Micro-Bar**: "⭐ 4.9/5 from 1,200+ members • Verified by USCCA".

### CSS Implementation
```css
.hero-container {
  position: relative;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6rem 1.5rem;
  background: radial-gradient(circle at 50% 20%, rgba(249, 115, 22, 0.12) 0%, transparent 60%),
              var(--bg-primary);
  overflow: hidden;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1rem;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--brand-primary);
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: var(--text-primary);
  max-width: 20ch;
  margin: 0 auto 1.5rem auto;
}

.hero-title .gradient-text {
  background: linear-gradient(135deg, var(--brand-primary) 0%, #ffedd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 58ch;
  margin: 0 auto 2.5rem auto;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
```

---

## 2. Bento Grid Layout Pattern

Bento grids break boring 3-column uniformity by introducing hierarchy and modular storytelling.

### Grid CSS
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

.bento-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 2rem;
  overflow: hidden;
  transition: transform var(--transition-smooth), border-color var(--transition-smooth), box-shadow var(--transition-smooth);
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(249, 115, 22, 0.1);
}

/* Wide Bento item spans 2 columns */
.bento-card.col-span-2 {
  grid-column: span 2;
}

@media (max-width: 900px) {
  .bento-card.col-span-2 {
    grid-column: span 1;
  }
}
```

---

## 3. High-Converting Interactive Buttons

```css
/* Primary Radiant Button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  background: var(--brand-primary);
  color: #0b0d10; /* Dark contrast on vibrant color */
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--brand-glow);
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background: var(--brand-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--brand-glow);
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Secondary Glass Button */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

---

## 4. Glassmorphic Navigation Bar

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(11, 13, 16, 0.75);
  border-bottom: 1px solid var(--border-subtle);
  transition: background var(--transition-smooth);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```
