import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';

import Contact from './Contact.jsx';
import { renderWithRouter } from '../test/utils.jsx';
import { CONTACT_DETAILS } from '../data/navigation.js';

describe('Contact page', () => {
  it('gives the page a single top-level heading', () => {
    renderWithRouter(<Contact />);
    expect(
      screen.getByRole('heading', { level: 1, name: /talk to a person/i })
    ).toBeInTheDocument();
  });

  it('makes the phone number and email actionable links', () => {
    renderWithRouter(<Contact />);

    expect(
      screen.getByRole('link', { name: CONTACT_DETAILS.phone })
    ).toHaveAttribute('href', CONTACT_DETAILS.phoneHref);
    expect(
      screen.getByRole('link', { name: CONTACT_DETAILS.email })
    ).toHaveAttribute('href', CONTACT_DETAILS.emailHref);
  });

  it('includes the message form', () => {
    renderWithRouter(<Contact />);
    expect(
      screen.getByRole('button', { name: /send message/i })
    ).toBeInTheDocument();
  });

  /**
   * Opening hours are genuinely tabular, so they use a real table. Scoped
   * headers are what let a screen reader announce "Saturday, 8:00 AM to 5:00
   * PM" instead of reading two disconnected columns of text.
   */
  it('presents opening hours as a table with scoped headers', () => {
    renderWithRouter(<Contact />);

    const table = screen.getByRole('table', { name: /opening hours/i });
    expect(table).toBeInTheDocument();

    expect(
      within(table).getByRole('columnheader', { name: /day/i })
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('columnheader', { name: /hours/i })
    ).toBeInTheDocument();
  });

  it('lists every opening-hours row with its day as a row header', () => {
    renderWithRouter(<Contact />);
    const table = screen.getByRole('table', { name: /opening hours/i });

    CONTACT_DETAILS.hours.forEach(({ days, time }) => {
      const header = within(table).getByRole('rowheader', { name: days });
      expect(header).toBeInTheDocument();
      expect(within(header.closest('tr')).getByText(time)).toBeInTheDocument();
    });
  });

  it('marks up the postal address as an address element', () => {
    const { container } = renderWithRouter(<Contact />);
    const address = container.querySelector('address');

    CONTACT_DETAILS.addressLines.forEach((line) => {
      expect(address).toHaveTextContent(line);
    });
  });
});
