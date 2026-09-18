# 25-Point Website Visual & UX Audit Checklist

Use this checklist during every website review to ensure no visual defects, accessibility violations, or missed aesthetic opportunities remain.

---

## 1. Visual Hierarchy & Composition (5 Points)
- [ ] **Instant Value Proposition**: Can a first-time visitor understand what the site offers in under 3 seconds?
- [ ] **Single Clear Focal Point per Section**: Does each viewport height have one dominant visual element rather than competing elements?
- [ ] **Z-Pattern / F-Pattern Flow**: Does the layout guide the natural reading scan down toward primary calls to action?
- [ ] **Bento / Asymmetric Variety**: Are repetitive lists or boring uniform 3-card columns broken up into dynamic, visually engaging modular blocks?
- [ ] **Breathing Room (Whitespace)**: Are section margins generous (minimum 80px–120px on desktop) to communicate quality and premium feel?

---

## 2. Color, Lighting & Atmosphere (5 Points)
- [ ] **Intentional Base Palette**: Is the background a bespoke tint (e.g., `#0b0d10` deep obsidian or `#faf8f5` warm alabaster) rather than harsh `#000000` or raw `#ffffff`?
- [ ] **Accents Used with Restraint**: Is the vibrant accent color reserved specifically for key interactive elements (CTAs, active pills, badges)?
- [ ] **Multi-Layered Surface Depth**: Do cards, dropdowns, and modals have distinct elevation layers rather than flat 1-dimensional planes?
- [ ] **Ambient Glow / Gradients**: Are subtle radial glows or gradient meshes used behind the hero or key cards to produce modern depth?
- [ ] **Contrast & Readability**: Do text colors pass WCAG AA contrast (minimum 4.5:1 for body, 3:1 for large display headings)?

---

## 3. Typography & Text Design (5 Points)
- [ ] **Font Pairing Harmony**: Is there a deliberate pairing of an expressive display font with a clean, highly legible body font?
- [ ] **Typographic Scale & Tracking**: Are headings tracked tighter (`letter-spacing: -0.02em` to `-0.04em`) to look refined?
- [ ] **Optimal Line Length**: Are text paragraphs constrained to 50–75 characters (`max-w: 65ch`) to prevent fatigue?
- [ ] **Generous Line Heights**: Is body text line-height at least 1.5 to 1.7?
- [ ] **Text Hierarchy Consistency**: Are H1, H2, H3, H4, and labels strictly mapped to designated size, weight, and color tokens?

---

## 4. Components & Micro-Interactions (5 Points)
- [ ] **CTA Visual Distinction**: Does the primary CTA stand out distinctly from secondary/tertiary buttons?
- [ ] **Tactile Hover & Active States**: Do buttons and cards provide immediate feedback (`transform: translateY(-2px)`, shadow glow, border brighten)?
- [ ] **Refined Border Treatments**: Are borders subtle (`1px solid rgba(255,255,255,0.08)` or equivalent light mode) instead of harsh dark lines?
- [ ] **Glassmorphism Blur Fallback**: Do frosted-glass headers and cards include `-webkit-backdrop-filter` and appropriate semi-transparent backgrounds?
- [ ] **Smooth Transition Timing**: Are all transitions using smooth easing curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`) with durations under 300ms?

---

## 5. Responsive Design & Conversion Polish (5 Points)
- [ ] **Mobile Touch Targets**: Are all interactive elements and buttons at least 44px by 44px on mobile viewports?
- [ ] **Fluid Typography**: Are major titles utilizing CSS `clamp()` so they scale gracefully without sudden wrapping or breaking?
- [ ] **Sticky Header Navigation**: Can users access navigation and the primary CTA from anywhere on long pages?
- [ ] **Social Proof & Credibility**: Are ratings, verified badges, partner/brand logos, or testimonials placed close to decision points?
- [ ] **No Overflow or Horizontal Scroll**: Is the page free of unwanted horizontal scrollbars or clipping on viewport resize?
