import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest configuration.
 *
 * Kept separate from vite.config.js so the dev/build config stays focused on
 * serving the app.
 *
 * The environment is jsdom because component tests in Phase 6b need a DOM.
 * Unit tests over the pure utilities do not care either way, and the cost of
 * booting jsdom is small compared with maintaining two configs.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    // Pinned to a US timezone on purpose. Date-only strings such as
    // "2026-08-10" parse as UTC, which lands on the previous day west of
    // Greenwich — the exact bug validateDate guards against. Running the
    // suite in UTC would let that regression pass unnoticed.
    env: { TZ: 'America/Chicago' },
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    // Playwright owns everything in e2e/; Vitest must not try to run it.
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.{test,spec}.{js,jsx}',
        'src/test/**',
        'src/main.jsx',
        // Content modules are data, not logic; covering them measures nothing.
        'src/data/**',
      ],
    },
  },
});
