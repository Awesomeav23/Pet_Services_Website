import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm.jsx';

const fillValid = async (user) => {
  await user.type(screen.getByLabelText(/your name/i), 'Elena Marsh');
  await user.type(screen.getByLabelText(/email address/i), 'elena@example.com');
  await user.type(
    screen.getByLabelText(/^message/i),
    'Could I book Bramble in for a groom next week?'
  );
};

const submit = (user) =>
  user.click(screen.getByRole('button', { name: /send message/i }));

describe('ContactForm', () => {
  it('labels every control', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what is this about/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message/i)).toBeInTheDocument();
  });

  it('reports all missing fields on an empty submit', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await submit(user);

    expect(screen.getByRole('alert')).toHaveTextContent(/3 problems/i);
  });

  it('moves focus to the error summary on a failed submit', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await submit(user);

    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus());
  });

  it('rejects a malformed email', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/email address/i), 'nope');
    await submit(user);

    expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('asks for more detail when the message is too short to act on', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^message/i), 'hi');
    await submit(user);

    expect(screen.getByRole('alert')).toHaveTextContent(/more detail/i);
  });

  it('clears a field error as soon as it is edited', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await submit(user);
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // Submitting schedules a focus move to the error summary on the next
    // animation frame. Typing before that lands lets the focus move interrupt
    // the keystroke, so wait for it to settle first — which is also the order
    // a real user works in: read the error, then fix the field.
    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus());

    await user.type(screen.getByLabelText(/your name/i), 'E');

    expect(screen.getByLabelText(/your name/i)).not.toHaveAttribute(
      'aria-invalid'
    );
  });

  it('confirms once a valid message is sent, and takes focus', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await submit(user);

    const confirmation = await screen.findByRole('status');
    expect(confirmation).toHaveTextContent(/message sent/i);
    await waitFor(() => expect(confirmation).toHaveFocus());
  });

  it('offers a way back to a blank form after sending', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await submit(user);
    await screen.findByRole('status');

    await user.click(screen.getByRole('button', { name: /send another/i }));

    expect(screen.getByLabelText(/your name/i)).toHaveValue('');
    expect(screen.getByLabelText(/^message/i)).toHaveValue('');
  });
});
