# 🐾 Pawsome Pet Services

[![CI](https://github.com/Awesomeav23/Pet_Services_Website/actions/workflows/ci.yml/badge.svg)](https://github.com/Awesomeav23/Pet_Services_Website/actions/workflows/ci.yml)

A responsive website for a fictional pet care business — grooming, boarding, daycare, dog walking, training, veterinary wellness and pet taxi. Visitors can browse the services on offer and send an appointment request through a multi-step form.

Built from scratch with **React**, **JavaScript (ES6+)**, **HTML5** and **CSS3**. No UI framework, no component library, no CSS toolkit — every button, card, form field and layout is hand-written.

Behind it is a **Node.js and Express** API over **PostgreSQL**: five REST endpoints and three tables. The service catalogue is read from the database rather than bundled, appointment requests are stored and come back with a reference, and contact messages are kept — so a booking survives the tab being closed, which the earlier build could not do.

> **This is a portfolio project.** Pawsome Pet Services is not a real business, the staff and reviews are invented, and nothing you type is sent anywhere. Form submissions are stored in your own browser and go no further.

---

## Table of contents

- [What the site does](#what-the-site-does)
- [Quick start](#quick-start)
- [The tech stack, explained](#the-tech-stack-explained)
- [How the project is organised](#how-the-project-is-organised)
- [How it works under the hood](#how-it-works-under-the-hood)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Responsive design](#responsive-design)
- [Performance](#performance)
- [Deployment](#deployment)
- [All available commands](#all-available-commands)

---

## What the site does

There are three main things a visitor can do.

### 1. Browse services

The services page lists **7 categories**, each with a price, a typical duration and which pets it suits. You can filter by pet type — All / Dogs / Cats — and the list updates instantly without a page reload.

Clicking any service opens its own page with the full description, an itemised list of what's included, and a booking button.

### 2. Request an appointment

A **three-step form**:

| Step | What you fill in |
| --- | --- |
| 1 | Which service you want |
| 2 | Your pet's details and your contact details |
| 3 | Preferred date, preferred time, and consent to be contacted |

You can't skip ahead with fields left blank — each step is checked before it lets you continue. Going *back* never re-checks anything, so you can always return and fix an earlier answer. When you submit, you get a confirmation screen with a reference number like `PAW-4F2A19`.

If you accidentally refresh mid-way through, **your answers are still there** — the form saves a draft as you type.

### 3. Learn about the business and get in touch

The About page has the company story, staff profiles, customer reviews and an expandable FAQ. The Contact page has a message form, phone and email links, and an opening-hours table.

---

## Quick start

You'll need [Node.js](https://nodejs.org) **version 18 or newer**. Check what you have with `node --version`.

The site reads its catalogue from the API, so both halves need to be running.
Nothing else has to be installed: PostgreSQL comes from the `embedded-postgres`
package, so there is no Homebrew, no Docker and no admin rights involved.

```bash
# 1. Get the code
git clone https://github.com/Awesomeav23/Pet_Services_Website.git
cd Pet_Services_Website

# 2. Install the dependencies, both halves
npm install
npm install --prefix server

# 3. Start PostgreSQL, apply the schema and seed the catalogue
cd server
cp .env.example .env
npm run setup

# 4. Start the API, and leave it running
npm run dev
```

Then in a second terminal:

```bash
# 5. Start the site
npm run dev
```

Then open **http://localhost:5173** in your browser. The API answers on
**http://localhost:4000**; `npm run db:stop` in `server/` shuts PostgreSQL down
when you are finished.

While `npm run dev` is running, any file you save appears in the browser almost instantly — you don't need to refresh. This is called **hot module replacement**, and it's one of the main reasons this project uses Vite.

To stop the server, press `Ctrl+C` in the terminal.

---

## The tech stack, explained

Here's what each piece actually does, in plain terms.

### React 18 — building the interface

React lets you build a page out of small, self-contained pieces called **components**, rather than writing one enormous HTML file. A component is a JavaScript function that returns something that looks like HTML.

For example, `ServiceCard` is a component that knows how to draw one service card. The services page doesn't repeat that markup seven times — it loops over the data and hands each service to the same component:

```jsx
{services.map((service) => (
  <ServiceCard service={service} key={service.id} />
))}
```

Change the card design in one file and all seven update. This project has **23 components**.

React also handles **state** — data that changes while the page is open, like which filter is selected or what you've typed into a form. When state changes, React works out the smallest set of DOM updates needed and applies them for you.

This project uses only **function components and hooks** (`useState`, `useEffect`, `useRef`, `useMemo`). There are no class components anywhere.

### Vite 5 — the build tool

Vite does two jobs:

- **In development**, it serves your files instantly and pushes changes into the browser as you save them.
- **For production**, it bundles everything into a small set of optimised files in a `dist/` folder, ready to upload to a web host.

It's the modern replacement for Create React App, which is no longer maintained.

### React Router 6 — moving between pages

A normal website asks the server for a whole new HTML document every time you click a link. That's slow and makes the screen flash white.

React Router intercepts link clicks and swaps out just the page content, keeping the header and footer in place. The URL still changes, the back button still works, and links are still shareable — but there's no round trip to a server.

The route table lives in `src/App.jsx`:

| URL | Page |
| --- | --- |
| `/` | Home |
| `/services` | All services, with filtering |
| `/services/:serviceId` | One service in detail (e.g. `/services/grooming`) |
| `/booking` | Appointment request form |
| `/about` | Story, team, reviews, FAQ |
| `/contact` | Contact form and details |
| anything else | 404 page |

The `:serviceId` part is a **URL parameter** — a wildcard. One route definition handles all seven service pages, reading the ID out of the URL to decide which one to display.

### CSS3 with CSS Modules — the styling

All styling is hand-written CSS3. Two techniques do the heavy lifting.

**CSS Modules** solve name collisions. Normally, if two stylesheets both define `.card`, they fight and the last one wins. With CSS Modules, each component gets its own `.module.css` file and the class names are made unique automatically at build time:

```jsx
import styles from './ServiceCard.module.css';

<article className={styles.card}>   // becomes something like _card_1x9k2_3
```

So `ServiceCard`'s `.card` and `TeamMemberCard`'s `.card` can never interfere with each other. Every component in this project owns a matching `.module.css` file.

**Design tokens** keep the site visually consistent. Every colour, font size, spacing value, border radius and shadow is defined once in `src/styles/tokens.css` as a CSS custom property:

```css
:root {
  --color-brand: #a8481b;
  --space-4: 1rem;
  --radius-md: 12px;
}
```

Components then reference the token instead of hardcoding a value:

```css
.button {
  background-color: var(--color-brand);
  padding: var(--space-4);
}
```

Change the brand colour in one place and the entire site follows. This also makes the accessibility checks possible — see below.

### JavaScript (ES6+)

Modern JavaScript features used throughout: modules (`import`/`export`), arrow functions, destructuring, spread syntax, template literals, optional chaining (`?.`), array methods (`map`, `filter`, `find`), and `Intl` for formatting prices and dates.

---

## How the project is organised

```
Pet_Services_Website/
│
├── index.html              The single HTML page everything loads into
├── package.json            Dependencies and commands
├── vite.config.js          Build tool settings
├── eslint.config.js        Code quality + accessibility rules
├── vercel.json             Deploy config for Vercel
│
├── public/
│   ├── favicon.svg         The little icon in the browser tab
│   └── _redirects          Deploy config for Netlify
│
├── scripts/
│   └── check-contrast.mjs  Automated colour contrast audit
│
└── src/
    ├── main.jsx            Entry point — starts React
    ├── App.jsx             The route table
    │
    ├── styles/
    │   ├── tokens.css      Colours, spacing, fonts, shadows
    │   └── global.css      Reset + base styles + helpers
    │
    ├── components/         23 reusable UI pieces
    ├── pages/              One file per page
    ├── hooks/              Reusable behaviour
    ├── utils/              Formatting and validation helpers
    └── data/               The site's content
```

### Why content lives in `src/data/`

The staff profiles, reviews and FAQs are plain JavaScript files that export arrays of objects. The service catalogue started the same way and now lives in PostgreSQL — `src/data/services.js` stayed put as the file the database is seeded from, so the seven services are still defined in exactly one place, and the bundle no longer carries a copy of them:

```js
export const SERVICES = [
  {
    id: 'grooming',
    name: 'Grooming & Spa',
    price: 55,
    duration: 90,
    petTypes: ['dog', 'cat'],
    // ...
  },
  // ...
];
```

Two benefits:

1. **Adding an eighth service is a data edit, not a code edit.** Add an object to the array and it appears on the services page, in the filters, in the booking form dropdown and in the related-services section — automatically.
2. **It's shaped like a real API response** — and that claim has since been tested. When the backend was added, `GET /api/services` returned the same shape the import had, so `ServiceCard`, `ServiceFilter` and the related-services section were untouched. What did change is everything around the data rather than the data itself: the pages had to grow loading, error and retry states, because a fetch can fail and a module import cannot. That is the part designing for a future API does not save you.

---

## How it works under the hood

A few of the more interesting mechanics.

### Filtering without a page reload

The services page keeps the selected filter in React state. Whenever it changes, the visible list is recalculated:

```jsx
const [petType, setPetType] = useState('all');

const visibleServices = useMemo(
  () => filterServicesByPetType(petType),
  [petType]
);
```

`useMemo` caches the result so the filtering only re-runs when `petType` actually changes, not on every unrelated re-render.

### Controlled form inputs

Every form field's value is stored in React state rather than being read out of the DOM. All the booking fields live in one object with a single change handler:

```jsx
const [form, setForm] = useState({ petName: '', email: '', /* ... */ });

const handleChange = (event) => {
  const { name, value } = event.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

The `[name]` syntax is a **computed property key** — it uses the input's `name` attribute to decide which field to update, so one handler serves every input on the page.

### Validation

Validation rules live in `src/utils/validation.js`, separate from the components. Each rule is a small function that returns an error message or nothing:

```js
export const validateEmail = (value) => {
  if (isBlank(value)) return 'Email address is required';
  if (!EMAIL_PATTERN.test(value.trim()))
    return 'Enter an email address in the format name@example.com';
  return undefined;
};
```

Keeping them out of the components means they're easy to read, easy to reuse (the contact form uses the same email rule) and easy to test.

One subtle bug this code deliberately avoids: a date-only string like `"2026-08-14"` is parsed as **UTC** by JavaScript's `Date`, which can land on the previous day for anyone in a western timezone. The validator splits the string and builds the date from local parts instead.

### Saving a draft

The booking form uses a custom hook, `useLocalStorage`, that behaves like `useState` but also writes to the browser's storage:

```jsx
const [form, setForm, clearStoredForm] = useLocalStorage(
  'pawsome:booking-draft',
  EMPTY_FORM
);
```

Refresh the page and your answers come back. The hook wraps its storage calls in `try/catch`, because `localStorage` throws in private browsing mode and when the storage quota is full — in those cases it quietly falls back to ordinary state instead of breaking the form.

---

## Accessibility

Accessibility means the site works for people using a keyboard instead of a mouse, a screen reader instead of a display, or a browser zoomed to 200%. It was built in from the start rather than audited at the end.

### Semantic HTML

Using the right HTML element gives you correct behaviour for free. A `<button>` is keyboard-operable and announces itself as a button; a `<div>` with a click handler does neither unless you rebuild all of it by hand.

This project uses real `<header>`, `<nav>`, `<main>` and `<footer>` landmarks (screen reader users can jump straight to a region), real `<table>` markup with `scope` attributes for the opening hours, `<blockquote>` and `<cite>` for reviews, and `<fieldset>`/`<legend>` around radio groups.

### Keyboard support

- Press **Tab** on any page and the first thing you reach is a "Skip to main content" link that jumps past the navigation.
- Every interactive element shows a clear blue focus ring.
- The mobile menu button reports its state with `aria-expanded`, and **Escape** closes the menu and returns focus to the button that opened it.
- The filter pills are real radio inputs, so **arrow keys** move between them — that's standard browser behaviour you get by using the right element.

### Focus management

In a single-page app, clicking a link doesn't reload anything, so a screen reader has no idea the page changed. This project fixes that explicitly: after every navigation, focus moves to `<main>` and the page title updates. On a failed form submission, focus jumps to a summary of what went wrong.

### Colour contrast — measured, not assumed

Text needs enough contrast against its background to be readable. WCAG sets the bar at **4.5:1** for body text and **3:1** for things like input borders.

Rather than eyeballing it, this project has an automated check:

```bash
npm run check:contrast
```

It reads the colours straight out of `tokens.css`, calculates the true contrast ratio for all **24** colour pairings the interface uses, prints a table, and exits with an error if any pair falls short.

**It found a real bug.** The original input border colour measured **1.86:1** against white — barely visible, and far below the required 3:1. It was darkened from `#c9bcae` to `#94836f`, which passes on white, page and tinted backgrounds alike. All 24 pairs now pass.

### Never colour alone

About 1 in 12 men has some form of colour blindness, so no state is signalled by colour on its own. The active nav link also gets bold weight and an underline. Selected filters also get a border change. Form errors also get a message and an icon.

### Enforced by the linter

`npm run lint` includes `eslint-plugin-jsx-a11y`, which catches accessibility mistakes automatically — a missing label, an invalid ARIA attribute, a click handler on a non-interactive element. When it was first added it found two genuine problems, both fixed rather than silenced.

### Other details

- Interactive controls are at least **44px** tall, the minimum comfortable touch target.
- All animation is disabled for anyone whose system is set to `prefers-reduced-motion` — important for people prone to motion sickness or vestibular disorders.

---

## Responsive design

The CSS is **mobile-first**: the base styles target small screens, and `@media` queries add complexity as the screen grows. This is the opposite of writing a desktop layout and trying to squeeze it down, and it produces simpler CSS.

Breakpoints are at 40rem, 48rem, 52rem, 56rem, 60rem and 64rem (1rem = 16px, so roughly 640px through 1024px). They were chosen where the layout actually needed to change, not to match specific devices.

- **Page structure** uses CSS Grid — service cards go 1 column → 2 → 3 as space allows.
- **Components** use Flexbox internally for alignment.
- **Headings** scale smoothly with `clamp()`, so text grows with the viewport instead of jumping at each breakpoint.
- **Navigation** collapses into a menu button below 56rem.

---

## Testing

Two suites, both run automatically on every push by GitHub Actions.

### Unit and integration tests — Vitest + React Testing Library

**189 tests, 90.5% coverage.** These run in a simulated DOM, so they're fast enough to keep running while you work (`npm run test:watch`).

| Area | Coverage |
| --- | --- |
| `src/utils` — formatters and validation | 100% |
| `src/api` — the fetch wrapper | 100% |
| `src/pages` | 95.6% |
| `src/hooks` | 93.2% |
| `src/components` | 85.6% |

They test **behaviour, not markup** — queries find elements the way a user would, by visible label or role, rather than by CSS class. A styling refactor doesn't break them; a behaviour change does.

The assertions deliberately protect design decisions. For example, one test asserts each service card contains *exactly one link*: the whole card is clickable via a single stretched link, so adding a second link would double the number of tab stops across the grid.

### Browser tests — Playwright + axe

**86 checks at 375px, 768px and 1280px**, run against the real production build. Each width is a separate project, so every check runs from a cold page load at that size rather than a mid-test resize.

| Spec | What it verifies |
| --- | --- |
| `booking` | The full journey: home → service → deep-linked form → confirmation, plus a draft surviving a real page reload |
| `keyboard` | Skip link is the first tab stop; focus moves on navigation but not on load; arrow keys in the filter group; Enter and Space on the accordion; Escape restoring focus |
| `responsive` | No horizontal scrolling on any route at any width; grid reflow 1 → 2 → 3 columns; navigation collapse; 44px touch targets |
| `a11y` | An axe scan of all seven routes, plus the booking form in its error state and the About page fully expanded |

### Why both

The browser suite exists because some things simply cannot be checked in a simulated DOM — and it earned its place immediately by finding three real bugs the other checks had missed:

- **The skip link was unreachable on page load.** Focus was being moved into `<main>` on first render as well as on navigation, so a keyboard user started past the header and could never tab back to the skip link — the opposite of its purpose.
- **Changing pages unmounted the whole shell.** The loading boundary wrapped the layout rather than the page content, so navigating to any lazily loaded route briefly replaced the header, navigation and footer with a loading message.
- **The 404 numerals failed contrast** at 1.14:1, against the 3:1 minimum for large text.

## Performance

Routes are **code split** using `React.lazy`. Instead of shipping the entire site in one JavaScript file, each page is bundled separately and downloaded only when someone visits it. Someone who reads the home page and leaves never downloads the booking form.

The measured effect:

| | Before splitting | After splitting |
| --- | --- | --- |
| Initial JavaScript | 220 kB | **188 kB** |
| Initial CSS | 38 kB | **16 kB** |

While a page chunk is loading, a fallback with `role="status"` announces the wait, so screen reader users aren't left on a silent blank screen.

---

## Deployment

```bash
npm run build
```

This produces a `dist/` folder of static files that can go on any web host — Netlify, Vercel, GitHub Pages, or ordinary shared hosting.

**One important catch.** Because routing happens in the browser, the server must return `index.html` for *every* path. Otherwise loading `/services/grooming` directly — or just refreshing that page — gives a 404, because there's no file at that path on disk.

Both config files are already included:

- `public/_redirects` — for Netlify
- `vercel.json` — for Vercel

---

## All available commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server at localhost:5173 |
| `npm run build` | Build the production files into `dist/` |
| `npm run preview` | Serve the built files locally, to check the real build |
| `npm run lint` | Check code quality and accessibility rules |
| `npm run check:contrast` | Measure every colour pair against WCAG |
| `npm test` | Run the unit and integration tests |
| `npm run test:watch` | Re-run tests as you save |
| `npm run test:coverage` | Tests with a coverage report |
| `npm run test:e2e` | Run the browser tests (builds first) |
| `npm run check` | Lint, contrast, tests, then build |

`npm run check` is the one to run before committing — if it passes, everything is in order.

---

## License

MIT — free to use, modify and learn from.
