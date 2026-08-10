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
npm run dev             # http://localhost:5173
npm run build           # production bundle in dist/
npm run preview         # serve the production build locally

npm run lint            # ESLint, including jsx-a11y rules
npm run check:contrast  # measure every colour pair against WCAG 2.1 AA
npm run check           # lint + contrast + build
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
  hooks/                # Shared behaviour (useDocumentTitle, useLocalStorage)
  utils/                # Formatters and validation rules
  data/                 # Static content modules (services, team, FAQs, ...)
scripts/
  check-contrast.mjs    # WCAG contrast audit over the design tokens
```

Each component owns a matching `*.module.css` file, so styles are scoped to the
component and class names can never collide across the site.

## Accessibility

Accessibility is treated as a build requirement, not a later audit:

- **Semantic HTML5 landmarks** — `header`, `nav`, `main`, `footer`, `address`, ordered/description lists where the content is genuinely a list.
- **Skip link** — the first focusable element jumps past navigation to `#main-content`.
- **Route-change focus management** — after navigation, focus moves to `<main>` and the document title updates, so screen-reader users are told the page changed.
- **Colour contrast, measured** — `npm run check:contrast` reads the tokens out of `tokens.css` and computes the real WCAG ratio for all 24 foreground/background pairs the UI uses, failing the build if any drops below its threshold (4.5:1 text, 3:1 non-text). The audit caught a genuine defect: the original control border sat at 1.86:1 against white, well under the 3:1 that WCAG 1.4.11 requires for input edges. It was darkened until it cleared on white, tinted and page backgrounds alike.
- **Linted, not just reviewed** — `eslint-plugin-jsx-a11y` runs as part of `npm run lint`, so a missing label or an unsupported ARIA attribute fails the check rather than surviving to production.
- **Never colour alone** — the active nav item is marked with weight, background and an underline in addition to colour.
- **Keyboard support** — visible focus ring site-wide, real `<button>`/`<a>` elements rather than clickable `div`s, `aria-expanded`/`aria-controls` on the mobile menu, and Escape closes it and restores focus to the trigger.
- **Touch targets** — interactive controls are at least 44px tall (WCAG 2.5.5).
- **Reduced motion** — animation and smooth scrolling are disabled under `prefers-reduced-motion: reduce`.

## Performance

Routes are split with `React.lazy`, so the first load carries the shell and the
home page only — the booking form, About content and detail pages arrive as
separate chunks when they are actually visited. That takes the initial bundle
from 220 kB to 188 kB of JavaScript and from 38 kB to 16 kB of CSS.

## Deployment

```bash
npm run build   # outputs dist/
```

Deploy `dist/` to any static host. Client-side routing needs every path served
`index.html`, or a refresh on `/services/grooming` returns 404 — `public/_redirects`
covers Netlify and `vercel.json` covers Vercel.

## Responsive design

Mobile-first CSS with a small number of deliberate breakpoints (40rem, 48rem, 52rem, 56rem, 60rem, 64rem). Layout uses CSS Grid for page structure and Flexbox within components. Type scales fluidly with `clamp()`.

## Roadmap

The site is being built section by section:

- [x] **Step 1 — Foundation:** project setup, design tokens, accessible layout shell (header, nav, footer, skip link), routing, home page
- [x] **Step 2 — Services:** 7 service categories, service cards, pet-type filtering, detail pages
- [x] **Step 3 — Booking:** multi-step appointment request form with validation and confirmation
- [x] **Step 4 — About & Contact:** team profiles, testimonials, FAQ accordion, contact form
- [x] **Step 5 — Polish:** automated contrast audit, ESLint with jsx-a11y, route-level code splitting, deploy config

Every navigation destination is a real page, and `npm run check` covers lint,
contrast and build in one command.

## License

MIT
