import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Services from './Services.jsx';
import { renderWithRouter } from '../test/utils.jsx';
import { SERVICES } from '../data/services.js';

const grid = () => screen.getByRole('list', { name: /available services/i });

/**
 * Counted by link rather than by list item.
 *
 * Each card contains its own list of pet-type tags, so getAllByRole('listitem')
 * would pick those up too. Every card holds exactly one link, which makes the
 * link count the reliable measure of how many cards are on screen.
 */
const cards = () => within(grid()).getAllByRole('link');

/**
 * Counts taken from the catalogue rather than hardcoded, so adding a service
 * updates the expectation instead of breaking the suite for the wrong reason.
 */
const DOG_COUNT = SERVICES.filter((s) => s.petTypes.includes('dog')).length;
const CAT_COUNT = SERVICES.filter((s) => s.petTypes.includes('cat')).length;

describe('Services page', () => {
  it('lists every service on first load', () => {
    renderWithRouter(<Services />);
    expect(cards()).toHaveLength(SERVICES.length);
  });

  it('reports the count in a live region, so filtering is announced', () => {
    renderWithRouter(<Services />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(`${SERVICES.length} services shown`);
  });

  it('narrows the grid to cat services', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Services />);

    await user.click(screen.getByLabelText('Cats'));

    expect(cards()).toHaveLength(CAT_COUNT);
    expect(screen.getByRole('status')).toHaveTextContent(
      `${CAT_COUNT} services shown for cats`
    );
  });

  it('narrows the grid to dog services', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Services />);

    await user.click(screen.getByLabelText('Dogs'));

    expect(cards()).toHaveLength(DOG_COUNT);
    expect(screen.getByRole('status')).toHaveTextContent(
      `${DOG_COUNT} services shown for dogs`
    );
  });

  it('drops services that do not suit the chosen pet', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Services />);

    // Daycare is dogs only, so it must disappear under the cat filter.
    expect(screen.getByRole('link', { name: /doggy daycare/i })).toBeInTheDocument();

    await user.click(screen.getByLabelText('Cats'));

    expect(
      screen.queryByRole('link', { name: /doggy daycare/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /overnight boarding/i })
    ).toBeInTheDocument();
  });

  it('restores the full list when the filter goes back to all pets', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Services />);

    await user.click(screen.getByLabelText('Cats'));
    await user.click(screen.getByLabelText('All pets'));

    expect(cards()).toHaveLength(SERVICES.length);
    // "for all pets" is not appended; the unfiltered message stays plain.
    expect(screen.getByRole('status')).toHaveTextContent(
      `${SERVICES.length} services shown`
    );
  });

  it('gives the page a single top-level heading', () => {
    renderWithRouter(<Services />);
    expect(
      screen.getByRole('heading', { level: 1, name: /seven ways/i })
    ).toBeInTheDocument();
  });
});
