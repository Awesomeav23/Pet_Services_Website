import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ServiceDetail from './ServiceDetail.jsx';

/**
 * ServiceDetail reads :serviceId from the URL, so it needs a matched route
 * rather than a bare router.
 */
const renderAt = (path) =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe('ServiceDetail page', () => {
  it('renders the service named in the URL', () => {
    renderAt('/services/grooming');

    expect(
      screen.getByRole('heading', { level: 1, name: /grooming & spa/i })
    ).toBeInTheDocument();
    expect(screen.getByText('$55')).toBeInTheDocument();
  });

  it('lists what the service includes', () => {
    renderAt('/services/grooming');

    expect(
      screen.getByRole('heading', { name: /what is included/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/nail trim and filing/i)).toBeInTheDocument();
  });

  it('pairs each summary fact with its label', () => {
    renderAt('/services/boarding');

    expect(screen.getByText('Typical length')).toBeInTheDocument();
    expect(screen.getByText('Full day')).toBeInTheDocument();
    expect(screen.getByText('Suitable for')).toBeInTheDocument();
    expect(screen.getByText('Dogs and Cats')).toBeInTheDocument();
  });

  it('deep links the booking button to this service', () => {
    renderAt('/services/daycare');

    expect(
      screen.getByRole('link', { name: /book doggy daycare/i })
    ).toHaveAttribute('href', '/booking?service=daycare');
  });

  it('exposes a breadcrumb trail with the current page marked', () => {
    renderAt('/services/training');

    // Scoped to the trail: the service name also appears in the page heading.
    const trail = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(within(trail).getByText('Obedience Training')).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(trail).getByRole('link', { name: 'Services' })).toHaveAttribute(
      'href',
      '/services'
    );
  });

  it('suggests related services without listing the current one', () => {
    renderAt('/services/grooming');

    const related = screen.getByRole('list', { name: /related services/i });
    expect(related).toBeInTheDocument();
    // The service being viewed must not appear in its own related list.
    expect(related).not.toHaveTextContent('Grooming & Spa');
  });

  /**
   * A stale bookmark or a mistyped URL must not take the app down. The
   * component looks the id up and falls through to the 404 page when it finds
   * nothing, rather than destructuring undefined.
   */
  it('renders the 404 page for an unknown service instead of crashing', () => {
    renderAt('/services/does-not-exist');

    expect(
      screen.getByRole('heading', { level: 1, name: /could not find that page/i })
    ).toBeInTheDocument();
  });
});
