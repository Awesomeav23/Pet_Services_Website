import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import TestimonialCard from './TestimonialCard.jsx';

const TESTIMONIAL = {
  id: 't-1',
  quote: 'Bramble has always hated the groomer, but not here.',
  author: 'Elena Marsh',
  petName: 'Bramble, cocker spaniel',
  rating: 4,
  service: 'Grooming & Spa',
};

describe('TestimonialCard', () => {
  it('renders the quote and its attribution', () => {
    render(<TestimonialCard testimonial={TESTIMONIAL} />);

    expect(screen.getByText(/bramble has always hated/i)).toBeInTheDocument();
    expect(screen.getByText('Elena Marsh')).toBeInTheDocument();
    expect(screen.getByText('Bramble, cocker spaniel')).toBeInTheDocument();
    expect(screen.getByText('Grooming & Spa')).toBeInTheDocument();
  });

  /**
   * The star row is decorative. If the rating existed only as ★ glyphs it
   * would be unreadable to a screen reader and lost if the font failed.
   */
  it('states the rating in text as well as stars', () => {
    render(<TestimonialCard testimonial={TESTIMONIAL} />);
    expect(screen.getByText(/rated 4 out of 5/i)).toBeInTheDocument();
  });

  it('hides the star glyphs from assistive technology', () => {
    render(<TestimonialCard testimonial={TESTIMONIAL} />);
    expect(screen.getByText('★★★★☆')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws the right number of filled and empty stars', () => {
    render(<TestimonialCard testimonial={{ ...TESTIMONIAL, rating: 5 }} />);
    expect(screen.getByText('★★★★★')).toBeInTheDocument();
  });

  it('marks the quote up as a blockquote with a cited source', () => {
    const { container } = render(<TestimonialCard testimonial={TESTIMONIAL} />);

    expect(container.querySelector('blockquote')).toHaveTextContent(
      /bramble has always hated/i
    );
    expect(container.querySelector('cite')).toHaveTextContent('Elena Marsh');
  });
});
