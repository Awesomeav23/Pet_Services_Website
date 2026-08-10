import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FaqAccordion from './FaqAccordion.jsx';

const ITEMS = [
  { id: 'faq-one', question: 'Do you take cats?', answer: 'Yes, we do.' },
  { id: 'faq-two', question: 'When do I pay?', answer: 'After the service.' },
];

const trigger = (name) => screen.getByRole('button', { name });

describe('FaqAccordion', () => {
  it('starts with every panel collapsed', () => {
    render(<FaqAccordion items={ITEMS} />);

    expect(trigger(/do you take cats/i)).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    // A collapsed answer must be out of the accessibility tree, not merely
    // painted out of sight.
    expect(screen.queryByText('Yes, we do.')).not.toBeVisible();
  });

  it('uses real buttons, so they are reachable and operable by keyboard', () => {
    render(<FaqAccordion items={ITEMS} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('opens on click and reports the change through aria-expanded', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={ITEMS} />);

    await user.click(trigger(/do you take cats/i));

    expect(trigger(/do you take cats/i)).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByText('Yes, we do.')).toBeVisible();
  });

  it('closes again on a second click', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={ITEMS} />);

    await user.click(trigger(/when do i pay/i));
    await user.click(trigger(/when do i pay/i));

    expect(trigger(/when do i pay/i)).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens with the Enter key', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={ITEMS} />);

    trigger(/do you take cats/i).focus();
    await user.keyboard('{Enter}');

    expect(trigger(/do you take cats/i)).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('opens with the Space key', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={ITEMS} />);

    trigger(/when do i pay/i).focus();
    await user.keyboard('{ }');

    expect(trigger(/when do i pay/i)).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows several panels open at once, so opening one never closes another', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={ITEMS} />);

    await user.click(trigger(/do you take cats/i));
    await user.click(trigger(/when do i pay/i));

    expect(screen.getByText('Yes, we do.')).toBeVisible();
    expect(screen.getByText('After the service.')).toBeVisible();
  });

  it('points each trigger at the panel it controls', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={ITEMS} />);
    await user.click(trigger(/do you take cats/i));

    const button = trigger(/do you take cats/i);
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent('Yes, we do.');
    // The panel names itself from its trigger, so it is announced in context.
    expect(panel).toHaveAttribute('aria-labelledby', button.id);
  });

  it('puts each question in a heading, so heading navigation reaches them', () => {
    render(<FaqAccordion items={ITEMS} />);
    expect(
      screen.getByRole('heading', { name: /do you take cats/i })
    ).toBeInTheDocument();
  });
});
