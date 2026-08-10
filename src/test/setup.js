import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Global test setup.
 *
 * Runs before every test file.
 */

afterEach(() => {
  // Unmount anything React Testing Library rendered, so one test cannot leave
  // DOM behind for the next.
  cleanup();

  // The booking form persists a draft; without this, one test's half-filled
  // form would repopulate in the next.
  window.localStorage.clear();

  // Any test that pinned the clock with vi.setSystemTime is restored here,
  // rather than each test having to remember to undo it.
  vi.useRealTimers();
});
