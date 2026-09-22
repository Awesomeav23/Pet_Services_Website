import { describe, it, expect } from 'vitest';
import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ServiceDetail from './ServiceDetail.jsx';

/**
 * ServiceDetail reads :serviceId from the URL, so it needs a matched route
 * rather than a bare router.
 */
const renderAt = async (path) => {
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

  // The service is fetched, so every test has to let the placeholder clear
  // before asserting on what replaced it.
  await waitForElementToBeRemoved(() => screen.queryByText(/loading service/i));
};

describe('ServiceDetail page', () => {
  it('renders the service named in the URL', async () => {
    await renderAt('/services/grooming');

    expect(
      screen.getByRole('heading', { level: 1, name: /grooming & spa/i })
    ).toBeInTheDocument();
    expect(screen.getByText('$55')).toBeInTheDocument();
  });

  it('lists what the service includes', async () => {
    await renderAt('/services/grooming');

    expect(
      screen.getByRole('heading', { name: /what is included/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/nail trim and filing/i)).toBeInTheDocument();
  });

  it('pairs each summary fact with its label', async () => {
    await renderAt('/services/boarding');

    expect(screen.getByText('Typical length')).toBeInTheDocument();
    expect(screen.getByText('Full day')).toBeInTheDocument();
    expect(screen.getByText('Suitable for')).toBeInTheDocument();
    expect(screen.getByText('Dogs and Cats')).toBeInTheDocument();
  });

  it('deep links the booking button to this service', async () => {
    await renderAt('/services/daycare');

    expect(
      screen.getByRole('link', { name: /book doggy daycare/i })
    ).toHaveAttribute('href', '/booking?service=daycare');
  });

  it('exposes a breadcrumb trail with the current page marked', async () => {
    await renderAt('/services/training');

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

  it('suggests related services without listing the current one', async () => {
    await renderAt('/services/grooming');

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
  it('renders the 404 page for an unknown service instead of crashing', async () => {
    await renderAt('/services/does-not-exist');

    expect(
      screen.getByRole('heading', { level: 1, name: /could not find that page/i })
    ).toBeInTheDocument();
  });
});
