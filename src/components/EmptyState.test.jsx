import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmptyState from './EmptyState.jsx';

/**
 * Covered directly rather than through the services page.
 *
 * Every current filter option returns at least one service, so this state is
 * unreachable through the UI today — it exists so that adding a pet type with
 * no matching services degrades gracefully instead of rendering a blank grid.
 */
describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(
      <EmptyState
        title="No services match that filter"
        description="Try viewing all pets instead."
      />
    );

    expect(
      screen.getByRole('heading', { name: /no services match that filter/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/try viewing all pets instead/i)).toBeInTheDocument();
  });

  it('omits the action when no handler is supplied', () => {
    render(<EmptyState title="Nothing here" actionLabel="Reset" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls the handler when the action is used', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        title="Nothing here"
        actionLabel="Show all services"
        onAction={onAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /show all services/i }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('hides the decorative icon from assistive technology', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText('🔍')).toHaveAttribute('aria-hidden', 'true');
  });
});
