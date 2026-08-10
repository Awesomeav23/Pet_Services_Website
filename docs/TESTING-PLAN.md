# Step 6 — Testing: Implementation Plan

## Goal

Two outcomes, not one:

1. A test suite that catches regressions when the project is refactored to consume a backend API.
2. **Closing the manual verification gap.** The keyboard tab-through and the 375/768/1280 responsive checks cannot be confirmed by a build tool. Playwright drives a real browser, so those checks become automated rather than pending.

---

## Tooling

| Tool | Job | Why this one |
| --- | --- | --- |
| **Vitest** | Test runner | Shares Vite's config and transform pipeline — no separate Babel or webpack setup. Jest-compatible API |
| **React Testing Library** | Component testing | Queries by what users see (role, label, text) rather than internals, so tests survive refactors |
| **@testing-library/user-event** | Interactions | Simulates real typing, clicking and tabbing rather than synthetic `fireEvent` |
| **jsdom** | Fake DOM | Lets component tests run without a browser |
| **Playwright** | End-to-end | Real Chromium, real keyboard, real viewport sizes |
| **@axe-core/playwright** | Automated a11y scan | Catches WCAG violations in the rendered page |

```bash
npm install -D vitest @vitest/coverage-v8 jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

---

## Progress

| Phase | Status | Tests |
| --- | --- | --- |
| 6a — Unit tests | ✅ Complete | 58 |
| 6b — Component tests | ✅ Complete | 60 |
| 6c — Page integration tests | ✅ Complete | 61 |
| 6d — End-to-end and accessibility | ✅ Complete | 86 |
| 6e — Continuous integration | Not started | — |

**179 unit and integration tests, plus 86 end-to-end checks** across three viewports (375, 768, 1280). Coverage against the targets set out below:

| Area | Coverage | Target |
| --- | --- | --- |
| `src/utils` | 100% | 100% |
| `src/pages` | 98.4% | ~70% |
| `src/components` | 88.0% | ~80% |
| Overall | **91.7%** | 75%+ |

Six defects were found by writing these tests rather than by inspection:

- `isBlank` classed the number `0` as blank, so a pet age of 0 would have read as a missing field (6a).
- The `validatePhone` digit-count fallback was unreachable by any existing test, and needed a no-digits case to cover it (6a).
- The featured-reviews list on the home page had no accessible name, so it could not be distinguished from the services list (6c).
- **The skip link was unreachable on page load** (6d). `ScrollToTop` moved focus to `<main>` on the first render as well as on navigations, so a keyboard user landed past the header and could never Tab to the skip link — the opposite of what it exists for. The first render is now exempt.
- **A route change unmounted the entire page shell** (6d). The `Suspense` boundary wrapped `Layout`, so navigating to a lazily loaded route replaced the header, navigation and footer with the loading state, and took `#main-content` out of the document exactly when focus needed to move to it. The boundary now sits around the `Outlet` inside `Layout`.
- **The 404 numerals failed contrast** (6d). They rendered in `--color-brand-tint` at 1.14:1 against the page background, well under the 3:1 large-text threshold. Caught by the axe scan and now covered by the token audit too.

The last two were invisible to the jsdom tests: one needed real Tab-order behaviour and the other needed an actual chunk load. They are the argument for phase 6d existing at all.

One correction to the plan below: the **Dogs** filter returns all 7 services, not 5. Every service in the catalogue accepts dogs; only four also accept cats. The tests derive both counts from the catalogue rather than hardcoding them.

---

## Phase 6a — Unit tests (~2 days)

Pure functions first: no DOM, no React, fastest to write and highest certainty.

### `src/utils/format.test.js`

| Function | Cases |
| --- | --- |
| `formatPrice` | `55` → `"$55"`, `0` → `"$0"` |
| `formatDuration` | `30` → `"30 min"`, `90` → `"1 hr 30 min"`, `600` → `"10 hr"`, `1440` → `"Full day"` |
| `formatList` | one item, two items, three items, empty |
| `pluralize` | `1` → `"1 service"`, `0` and `3` → `"services"` |

### `src/utils/validation.test.js`

| Function | Cases |
| --- | --- |
| `validateEmail` | blank, missing `@`, missing TLD, valid, surrounding whitespace |
| `validatePhone` | 9 digits (fail), 10 (pass), 11 (pass), 12 (fail), formatted `(555) 018-7742` |
| `validateDate` | blank, yesterday, **today**, seven months out, valid |
| `validatePetAge` | blank (optional, passes), `-1`, `31`, `4` |
| Step validators | return `{}` when valid, keyed errors when not |

> **Critical test:** `validateDate` must pass for **today's date**. That is the UTC-parsing bug the implementation guards against — a naive `new Date("2026-08-10")` parses as UTC and reads as the previous day in US timezones. Pin the clock with `vi.setSystemTime()` so this can never flake.

---

## Phase 6b — Component tests (~4 days)

Test behaviour and accessibility contracts, never CSS classes.

| Component | What to assert |
| --- | --- |
| `FormField` | Label associated with input; `aria-describedby` includes hint and error ids; `aria-invalid` only when erroring; renders input/textarea/select per `as` |
| `ServiceCard` | Name, price and duration render; link points at `/services/:id`; **exactly one link in the card** |
| `ServiceFilter` | Renders as a radio group with a legend; clicking an option fires `onChange` with the right value |
| `FaqAccordion` | `aria-expanded` starts `false`; clicking toggles; panel `hidden` when closed; **Enter and Space both activate**; opening one does not close another |
| `ErrorSummary` | Renders nothing when errors are empty; pluralises the count; each entry links to `#field` |
| `StepIndicator` | Correct step has `aria-current="step"`; completed steps expose "(completed)" |
| `Navbar` | Toggle has `aria-expanded`; **Escape closes and returns focus to the trigger**; clicking a link closes the panel |
| `TestimonialCard` | Rating exposed as text ("Rated 5 out of 5"), not only star glyphs |

**Gotchas to handle in setup:**

- Components using `Link`/`NavLink` need a `<MemoryRouter>` wrapper — build a `renderWithRouter` helper.
- CSS Modules resolve to proxies under Vitest, so **never assert on class names**. Query by role and accessible name.
- Clear `localStorage` in `afterEach`, or booking tests bleed into one another.

---

## Phase 6c — Page integration tests (~3 days)

Whole flows with real state.

**Services page**

- Renders 7 cards initially; count reads "7 services shown"
- Selecting **Cats** narrows to 4 and updates the live region
- Selecting **Dogs** narrows to 5
- Empty state renders when a filter matches nothing, and its reset button restores the full list

**Booking page** — the highest-value tests in the suite

- Continue on step 1 with nothing selected **blocks advancement and shows the error summary**
- The error summary **receives focus** after a failed submit
- Invalid email on step 2 produces an inline error tied to the field
- Editing a field **clears its error** without resubmitting
- **Back never validates** — a step with errors can still be retreated from
- Full happy path reaches the confirmation with a `PAW-` reference
- `?service=grooming` **pre-selects** grooming
- A draft in `localStorage` **repopulates** on remount

**ServiceDetail**

- Valid id renders name, price and includes list
- **Unknown id renders the 404 page** rather than crashing

---

## Phase 6d — End-to-end and accessibility (~3 days)

The phase that closes the outstanding manual checks.

- **`e2e/booking.spec.js`** — full journey in a real browser: home → service → booking → confirmation.
- **`e2e/keyboard.spec.js`** — first Tab reveals the skip link and Enter moves focus into `<main>`; filter pills are one tab stop with arrow keys moving between them; each service card is one tab stop; Escape closes the mobile menu and restores focus.
- **`e2e/responsive.spec.js`** — at 375, 768 and 1280 assert the grid column count, that the nav collapses below 896px, and that `document.body.scrollWidth <= window.innerWidth` so nothing overflows horizontally.
- **`e2e/a11y.spec.js`** — axe against all six routes, plus the booking form in its error state and its confirmation state. Assert zero violations.

---

## Phase 6e — Continuous integration (~1 day)

`.github/workflows/ci.yml` on every push and pull request:

```
npm ci → npm run lint → npm run check:contrast
       → npm run test → npm run build → npm run test:e2e
```

Adds a status badge to the README and makes broken pushes visible instead of silent.

---

## Scripts to add

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"test:e2e": "playwright test",
"check": "npm run lint && npm run check:contrast && npm run test && npm run build"
```

## Coverage targets

Realistic rather than vanity numbers:

| Area | Target |
| --- | --- |
| `utils/` | 100% — pure functions, no excuse |
| `components/` | ~80% |
| `pages/` | ~70% — flows matter more than lines |
| Overall | **75%+** |

## Commit plan

Seven commits: setup → format tests → validation tests → component tests → page tests → E2E and axe → CI and README.

## Estimated effort

Roughly 2.5 weeks.

---

## Two principles

**Do not chase 100% overall.** Asserting that `Footer` renders a footer is busywork. The booking flow and the validation logic are where bugs actually live and where tests earn their keep.

**Phase 6d is the one to protect if time runs short.** It is the only part that provides something the project does not have in any form today: verified keyboard and responsive behaviour in a real browser.
