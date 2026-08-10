import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Navbar from './Navbar.jsx';
import { renderWithRouter } from '../test/utils.jsx';
import { NAV_LINKS } from '../data/navigation.js';

const menuButton = () => screen.getByRole('button', { name: /menu/i });

describe('Navbar', () => {
  it('exposes the primary navigation as a labelled landmark', () => {
    renderWithRouter(<Navbar />);
    expect(
      screen.getByRole('navigation', { name: /primary/i })
    ).toBeInTheDocument();
  });

  it('renders every registered navigation link', () => {
    renderWithRouter(<Navbar />);

    NAV_LINKS.forEach(({ label }) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it('marks the current section with aria-current, not colour alone', () => {
    renderWithRouter(<Navbar />, { route: '/services' });

    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('starts with the mobile panel closed', () => {
    renderWithRouter(<Navbar />);
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens and closes the panel from the toggle', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('points the toggle at the navigation it controls', () => {
    renderWithRouter(<Navbar />);

    const controls = menuButton().getAttribute('aria-controls');
    expect(document.getElementById(controls)).toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    await user.click(menuButton());
    await user.keyboard('{Escape}');

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    // Focus must come back, or a keyboard user is stranded at the top of the
    // document after dismissing the menu.
    expect(menuButton()).toHaveFocus();
  });

  it('ignores Escape when the panel is already closed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    await user.keyboard('{Escape}');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the panel when a navigation link is chosen', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    await user.click(menuButton());
    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });
});
