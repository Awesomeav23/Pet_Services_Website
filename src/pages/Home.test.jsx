import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';

import Home from './Home.jsx';
import { renderWithRouter } from '../test/utils.jsx';
import { getPopularServices } from '../data/services.js';
import { getFeaturedTestimonials } from '../data/testimonials.js';

describe('Home page', () => {
  it('gives the page a single top-level heading', () => {
    renderWithRouter(<Home />);
    expect(
      screen.getByRole('heading', { level: 1, name: /care your pet/i })
    ).toBeInTheDocument();
  });

  it('offers both primary journeys from the hero', () => {
    renderWithRouter(<Home />);

    expect(
      screen.getAllByRole('link', { name: /request an appointment/i })[0]
    ).toHaveAttribute('href', '/booking');
    expect(
      screen.getByRole('link', { name: /browse services/i })
    ).toHaveAttribute('href', '/services');
  });

  it('previews only the popular services, not the whole catalogue', () => {
    renderWithRouter(<Home />);

    const popular = screen.getByRole('list', { name: /popular services/i });
    expect(within(popular).getAllByRole('link')).toHaveLength(
      getPopularServices().length
    );
  });

  it('shows only the featured reviews, not every review', () => {
    renderWithRouter(<Home />);

    const featured = getFeaturedTestimonials();
    const reviews = screen.getByRole('list', { name: /featured reviews/i });

    expect(within(reviews).getAllByRole('figure')).toHaveLength(featured.length);
    featured.forEach(({ author }) => {
      expect(within(reviews).getByText(author)).toBeInTheDocument();
    });
  });

  it('explains the process as an ordered sequence', () => {
    renderWithRouter(<Home />);

    expect(
      screen.getByRole('heading', { name: /booking takes about two minutes/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /tell us about your pet/i })
    ).toBeInTheDocument();
  });

  it('links through to the full catalogue', () => {
    renderWithRouter(<Home />);
    expect(
      screen.getByRole('link', { name: /view all seven services/i })
    ).toHaveAttribute('href', '/services');
  });
});
