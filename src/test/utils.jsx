import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * Shared test helpers.
 *
 * This file is deliberately not named *.test.jsx so Vitest does not try to
 * collect it as a suite.
 */

/**
 * Render a component that uses Link, NavLink or any router hook.
 *
 * Those throw outside a router context, so anything reachable from a page
 * needs this rather than plain render(). `route` seeds the initial history
 * entry, which is how the deep-link and URL-parameter cases are exercised.
 */
export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter
      initialEntries={[route]}
      // Opting in early keeps the v7 deprecation notices out of the test
      // output, so real warnings are not buried in known noise.
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {ui}
    </MemoryRouter>
  );
}
