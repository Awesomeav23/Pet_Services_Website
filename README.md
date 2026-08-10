# Pawsome Pet Services

A responsive pet services website built with **React**, **JavaScript (ES6+)**, **HTML5** and **CSS3** — no UI framework, no component library. Styling is hand-written CSS3 using custom properties and CSS Modules.

> Demo/portfolio project. Pawsome Pet Services is not a real business and no data is sent anywhere.

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Build tool | Vite 5 | Native ES modules, instant HMR, no config |
| UI | React 18 | Function components + hooks only |
| Routing | React Router 6 | Client-side routing across site sections |
| Styling | CSS3 + CSS Modules | Scoped class names, design tokens via custom properties |
| Language | JavaScript (ES6+) | Modules, destructuring, spread, optional chaining, arrow functions |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build locally
```

Requires Node 18 or newer.

## Project structure

```
src/
  main.jsx              # React root + BrowserRouter
  App.jsx               # Route table
  styles/
    tokens.css          # Design tokens (colour, type, spacing, motion)
    global.css          # Reset, base elements, layout + a11y utilities
  components/           # Reusable, single-responsibility UI pieces
  pages/                # One component per route
  hooks/                # Shared behaviour (useDocumentTitle, ...)
  data/                 # Static content modules (navigation, ...)
```

Each component owns a matching `*.module.css` file, so styles are scoped to the
component and class names can never collide across the site.

## Accessibility

Accessibility is treated as a build requirement, not a later audit:

- **Semantic HTML5 landmarks** — `header`, `nav`, `main`, `footer`, `address`, ordered/description lists where the content is genuinely a list.
- **Skip link** — the first focusable element jumps past navigation to `#main-content`.
- **Route-change focus management** — after navigation, focus moves to `<main>` and the document title updates, so screen-reader users are told the page changed.
- **Colour contrast** — every text/background pair in `tokens.css` meets WCAG 2.1 AA (4.5:1 body text, 3:1 large text). Measured ratios are documented inline beside each token.
- **Never colour alone** — the active nav item is marked with weight, background and an underline in addition to colour.
- **Keyboard support** — visible focus ring site-wide, real `<button>`/`<a>` elements rather than clickable `div`s, `aria-expanded`/`aria-controls` on the mobile menu, and Escape closes it and restores focus to the trigger.
- **Touch targets** — interactive controls are at least 44px tall (WCAG 2.5.5).
- **Reduced motion** — animation and smooth scrolling are disabled under `prefers-reduced-motion: reduce`.

## Responsive design

Mobile-first CSS with a small number of deliberate breakpoints (40rem, 48rem, 52rem, 56rem, 60rem, 64rem). Layout uses CSS Grid for page structure and Flexbox within components. Type scales fluidly with `clamp()`.

## Roadmap

The site is being built section by section:

- [x] **Step 1 — Foundation:** project setup, design tokens, accessible layout shell (header, nav, footer, skip link), routing, home page
- [x] **Step 2 — Services:** 7 service categories, service cards, pet-type filtering, detail pages
- [ ] **Step 3 — Booking:** multi-step appointment request form with validation and confirmation
- [ ] **Step 4 — About & Contact:** team profiles, testimonials, FAQ accordion, contact form
- [ ] **Step 5 — Polish:** full keyboard/contrast audit, responsive pass, performance

Routes for unfinished sections currently render a placeholder page so that
navigation, the skip link and focus management can be exercised end to end.

## License

MIT
