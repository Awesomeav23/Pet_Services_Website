# 🐾 Pawsome Pet Services

A responsive website for a fictional pet care business — grooming, boarding, daycare, dog walking, training, veterinary wellness and pet taxi. Visitors can browse the services on offer and send an appointment request through a multi-step form.

Built from scratch with **React**, **JavaScript (ES6+)**, **HTML5** and **CSS3**. No UI framework, no component library, no CSS toolkit — every button, card, form field and layout is hand-written.

> **This is a portfolio project.** Pawsome Pet Services is not a real business, the staff and reviews are invented, and nothing you type is sent anywhere. Form submissions are stored in your own browser and go no further.

---

## Table of contents

- [What the site does](#what-the-site-does)
- [Quick start](#quick-start)
- [The tech stack, explained](#the-tech-stack-explained)
- [How the project is organised](#how-the-project-is-organised)
- [How it works under the hood](#how-it-works-under-the-hood)
- [Accessibility](#accessibility)
- [Responsive design](#responsive-design)
- [Performance](#performance)
- [Deployment](#deployment)
- [All available commands](#all-available-commands)
- [Roadmap](#roadmap)

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

```bash
# 1. Get the code
git clone https://github.com/Awesomeav23/Pet_Services_Website.git
cd Pet_Services_Website

# 2. Install the dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open **http://localhost:5173** in your browser.

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

The services, staff profiles, reviews and FAQs aren't written into the components — they're plain JavaScript files that export arrays of objects:

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
2. **It's shaped like a real API response.** If this project later gained a backend, you'd replace the import with a `fetch()` call and the components wouldn't need to change at all.

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
| `npm run check` | Run all three: lint, contrast, then build |

`npm run check` is the one to run before committing — if it passes, everything is in order.

---

## Roadmap

The front end is complete. The next phase turns it into a full-stack application:

1. **Backend API** — Node/Express with PostgreSQL, so bookings persist server-side.
2. **Automated tests** — Vitest and React Testing Library for components, Playwright for full user journeys.
3. **User accounts** — saved pet profiles and visit history.
4. **Staff dashboard** — approve, decline and reschedule incoming requests.
5. **Availability engine** — capacity limits and conflict detection.
6. **Email notifications** — confirmations and reminders.
7. **Continuous integration** — GitHub Actions running `npm run check` on every pull request.

---

## License

MIT — free to use, modify and learn from.
