import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * The API client is mocked for every component test.
 *
 * Resolving from the same catalogue the database is seeded with keeps the
 * assertions honest — a test that counts seven cards is counting the seven
 * services that actually exist — while leaving the suite fast and offline.
 * Individual tests override a method (mockRejectedValueOnce, and so on) to
 * exercise failure paths.
 */
vi.mock('../api/client.js', async () => {
  const { SERVICES } = await import('../data/services.js');

  class ApiError extends Error {
    constructor(message, { status, fieldErrors } = {}) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.fieldErrors = fieldErrors ?? {};
    }
  }

  const defaults = {
    fetchServices: (petType = 'all') =>
      Promise.resolve(
        petType === 'all'
          ? SERVICES
          : SERVICES.filter((service) => service.petTypes.includes(petType)),
      ),
    fetchService: (id) => {
      const service = SERVICES.find((item) => item.id === id);
      return service
        ? Promise.resolve(service)
        : Promise.reject(new ApiError('Service not found', { status: 404 }));
    },
    createBooking: () =>
      Promise.resolve({ reference: 'PAW-TEST01', submittedAt: '2026-01-01T00:00:00.000Z' }),
    fetchBooking: () => Promise.reject(new ApiError('Booking not found', { status: 404 })),
    sendContactMessage: () =>
      Promise.resolve({ id: '1', receivedAt: '2026-01-01T00:00:00.000Z' }),
  };

  const mocked = Object.fromEntries(
    Object.entries(defaults).map(([name, implementation]) => [name, vi.fn(implementation)]),
  );

  return {
    ApiError,
    ...mocked,
    /** Restores the default implementations between tests. */
    __resetApiMock: () => {
      for (const [name, implementation] of Object.entries(defaults)) {
        mocked[name].mockReset();
        mocked[name].mockImplementation(implementation);
      }
    },
  };
});

/**
 * Global test setup.
 *
 * Runs before every test file.
 */

afterEach(async () => {
  // Any per-test override (a rejection, a delayed resolve) is undone here so
  // it cannot leak into the next file.
  const { __resetApiMock } = await import('../api/client.js');
  __resetApiMock();

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
