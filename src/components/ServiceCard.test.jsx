import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';

import ServiceCard from './ServiceCard.jsx';
import { renderWithRouter } from '../test/utils.jsx';

const SERVICE = {
  id: 'grooming',
  name: 'Grooming & Spa',
  tagline: 'Baths, trims and nail care',
  price: 55,
  priceUnit: 'per visit',
  duration: 90,
  petTypes: ['dog', 'cat'],
  icon: '🛁',
  popular: true,
};

describe('ServiceCard', () => {
  it('shows the service name, tagline and formatted price', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);

    expect(
      screen.getByRole('heading', { name: /grooming & spa/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/baths, trims and nail care/i)).toBeInTheDocument();
    expect(screen.getByText('$55')).toBeInTheDocument();
    expect(screen.getByText('per visit')).toBeInTheDocument();
  });

  it('shows the duration in readable form rather than raw minutes', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    expect(screen.getByText('1 hr 30 min')).toBeInTheDocument();
  });

  it('lists which pets the service suits, as text rather than colour', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByText('Cats')).toBeInTheDocument();
  });

  it('links to the detail page for this service', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/services/grooming'
    );
  });

  /**
   * The card is clickable all over, but the whole surface is covered by one
   * stretched link. More than one link here would mean several tab stops per
   * card and a much longer keyboard journey through the grid.
   */
  it('contains exactly one link, so each card is a single tab stop', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('names the link after the service, not a generic "learn more"', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    // Seven identical "Learn more" links would be useless in a link list.
    expect(
      screen.getByRole('link', { name: /grooming & spa/i })
    ).toBeInTheDocument();
  });

  it('flags a popular service in text', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    expect(screen.getByText(/most requested/i)).toBeInTheDocument();
  });

  it('omits the popular flag when the service is not popular', () => {
    renderWithRouter(
      <ServiceCard service={{ ...SERVICE, popular: false }} />
    );
    expect(screen.queryByText(/most requested/i)).not.toBeInTheDocument();
  });

  it('hides the decorative icon from assistive technology', () => {
    renderWithRouter(<ServiceCard service={SERVICE} />);
    const article = screen.getByRole('article');
    expect(within(article).getByText('🛁')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
