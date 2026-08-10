/**
 * WCAG 2.1 contrast checker for the design tokens.
 *
 * Reads the colour custom properties straight out of src/styles/tokens.css and
 * measures every foreground/background pair the UI actually uses, so the
 * accessibility claim in the README is backed by a number rather than an
 * assumption. Run with `npm run check:contrast`.
 *
 * Exits non-zero if any pair falls below its required ratio.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(here, '../src/styles/tokens.css');

/** Pull `--name: #value;` declarations out of the stylesheet. */
const readTokens = () => {
  const css = readFileSync(tokensPath, 'utf8');
  const tokens = {};

  for (const [, name, value] of css.matchAll(
    /(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g
  )) {
    tokens[name] = value;
  }

  return tokens;
};

const toRgb = (hex) => {
  let value = hex.replace('#', '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
};

/** WCAG relative luminance. */
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (foreground, background) => {
  const a = luminance(foreground);
  const b = luminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Every pairing the UI relies on.
 *
 * `min` is 4.5 for body text, 3 for large text (>=24px or >=18.66px bold) and
 * for non-text boundaries such as borders and focus rings, per WCAG 1.4.3 and
 * 1.4.11.
 */
const PAIRS = [
  { fg: '--color-ink', bg: '--color-surface', min: 4.5, use: 'Body text on page background' },
  { fg: '--color-ink', bg: '--color-card', min: 4.5, use: 'Body text on cards' },
  { fg: '--color-ink', bg: '--color-surface-alt', min: 4.5, use: 'Body text on tinted sections' },
  { fg: '--color-ink-soft', bg: '--color-surface', min: 4.5, use: 'Secondary text on page background' },
  { fg: '--color-ink-soft', bg: '--color-card', min: 4.5, use: 'Secondary text on cards' },
  { fg: '--color-ink-soft', bg: '--color-surface-alt', min: 4.5, use: 'Secondary text on tinted sections' },
  { fg: '--color-ink-inverse', bg: '--color-brand', min: 4.5, use: 'Primary button label' },
  { fg: '--color-ink-inverse', bg: '--color-brand-strong', min: 4.5, use: 'Primary button label, hover' },
  { fg: '--color-ink-inverse', bg: '--color-accent', min: 4.5, use: 'Accent badge label' },
  { fg: '--color-ink-inverse', bg: '--color-success', min: 4.5, use: 'Confirmation icon' },
  { fg: '--color-brand-strong', bg: '--color-surface', min: 4.5, use: 'Links and eyebrow text' },
  { fg: '--color-brand-strong', bg: '--color-card', min: 4.5, use: 'Price and link text on cards' },
  { fg: '--color-brand-strong', bg: '--color-brand-tint', min: 4.5, use: 'Active nav item, selected filter' },
  { fg: '--color-brand-strong', bg: '--color-surface-alt', min: 4.5, use: 'Links on tinted sections' },
  { fg: '--color-accent', bg: '--color-accent-tint', min: 4.5, use: '"Most requested" badge' },
  { fg: '--color-accent', bg: '--color-card', min: 4.5, use: 'Checklist ticks, team credentials' },
  { fg: '--color-danger', bg: '--color-card', min: 4.5, use: 'Form error messages' },
  { fg: '--color-danger', bg: '--color-surface', min: 4.5, use: 'Required-field markers' },
  { fg: '--color-focus', bg: '--color-surface', min: 3, use: 'Focus ring on page background' },
  { fg: '--color-focus', bg: '--color-card', min: 3, use: 'Focus ring on cards' },
  { fg: '--color-border-strong', bg: '--color-card', min: 3, use: 'Input and control borders' },
  { fg: '--color-border-strong', bg: '--color-surface', min: 3, use: 'Control borders on page background' },
  { fg: '--color-border-strong', bg: '--color-surface-alt', min: 3, use: 'Control borders on tinted sections' },
  { fg: '--color-brand', bg: '--color-card', min: 3, use: 'Selected control border' },
  { fg: '--color-border-strong', bg: '--color-surface', min: 3, use: '404 numerals (large text)' },
];

const tokens = readTokens();
const results = [];
let failures = 0;

for (const pair of PAIRS) {
  const fg = tokens[pair.fg];
  const bg = tokens[pair.bg];

  if (!fg || !bg) {
    console.error(`Missing token: ${!fg ? pair.fg : pair.bg}`);
    failures += 1;
    continue;
  }

  const ratio = contrast(fg, bg);
  const passed = ratio >= pair.min;
  if (!passed) failures += 1;

  results.push({
    Use: pair.use,
    Foreground: `${pair.fg} ${fg}`,
    Background: `${pair.bg} ${bg}`,
    Ratio: `${ratio.toFixed(2)}:1`,
    Required: `${pair.min}:1`,
    Result: passed ? 'PASS' : 'FAIL',
  });
}

console.table(results);

const total = PAIRS.length;
if (failures > 0) {
  console.error(`\n${failures} of ${total} colour pairs fail WCAG 2.1 AA.`);
  process.exit(1);
}

console.log(`\nAll ${total} colour pairs meet WCAG 2.1 AA.`);
