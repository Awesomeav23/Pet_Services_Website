import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import About from './About.jsx';
import { renderWithRouter } from '../test/utils.jsx';
import { TEAM } from '../data/team.js';
import { TESTIMONIALS } from '../data/testimonials.js';
import { FAQS } from '../data/faqs.js';

describe('About page', () => {
  it('gives the page a single top-level heading', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByRole('heading', { level: 1, name: /stayed small on purpose/i })
    ).toBeInTheDocument();
  });

  it('lists every team member with their role and credentials', () => {
    renderWithRouter(<About />);

    TEAM.forEach(({ name, role, credentials }) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
      expect(screen.getByText(role)).toBeInTheDocument();
      expect(screen.getByText(credentials)).toBeInTheDocument();
    });
  });

  it('renders every testimonial', () => {
    const { container } = renderWithRouter(<About />);
    expect(container.querySelectorAll('blockquote')).toHaveLength(
      TESTIMONIALS.length
    );
  });

  it('renders every FAQ as a collapsed question', () => {
    renderWithRouter(<About />);

    FAQS.forEach(({ question }) => {
      expect(screen.getByRole('button', { name: question })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });
  });

  it('reveals an answer when its question is opened', async () => {
    const user = userEvent.setup();
    renderWithRouter(<About />);

    const [first] = FAQS;
    await user.click(screen.getByRole('button', { name: first.question }));

    expect(screen.getByText(first.answer)).toBeVisible();
  });

  it('offers a route to the contact page for anything unanswered', () => {
    renderWithRouter(<About />);
    expect(
      screen.getByRole('link', { name: /ask us directly/i })
    ).toHaveAttribute('href', '/contact');
  });

  it('hides the decorative monogram avatars from assistive technology', () => {
    renderWithRouter(<About />);

    // The name sits beside the monogram as real text, so the tile adds nothing
    // for a screen reader.
    const [member] = TEAM;
    const heading = screen.getByRole('heading', { name: member.name });
    const card = heading.closest('article');
    expect(within(card).getByText(member.initials)).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
