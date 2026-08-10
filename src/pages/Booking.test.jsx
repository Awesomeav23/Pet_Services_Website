import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Booking from './Booking.jsx';
import { renderWithRouter } from '../test/utils.jsx';

const DRAFT_KEY = 'pawsome:booking-draft';
const REQUESTS_KEY = 'pawsome:booking-requests';

/**
 * A date a fixed distance in the future, derived from the real clock.
 *
 * Fake timers are avoided here on purpose: user-event schedules its own
 * timers, and pinning the clock without wiring advanceTimers makes the
 * interactions hang. Deriving the date keeps the test deterministic without
 * that complication.
 */
const futureDateISO = (daysAhead = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().split('T')[0];
};

const continueButton = () => screen.getByRole('button', { name: /continue/i });
const stepHeading = (name) => screen.getByRole('heading', { level: 2, name });

/** Walk the form from step 1 to step 2 with a service chosen. */
const goToDetailsStep = async (user) => {
  await user.click(screen.getByRole('radio', { name: /grooming/i }));
  await user.click(continueButton());
};

/** Fill step 2 with valid values and advance to step 3. */
const goToScheduleStep = async (user) => {
  await goToDetailsStep(user);
  await user.type(screen.getByLabelText(/pet name/i), 'Bramble');
  await user.type(screen.getByLabelText(/your name/i), 'Elena Marsh');
  await user.type(screen.getByLabelText(/email address/i), 'elena@example.com');
  await user.type(screen.getByLabelText(/phone number/i), '5550187742');
  await user.click(continueButton());
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('Booking page — step gating', () => {
  it('starts on step 1', () => {
    renderWithRouter(<Booking />);

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(stepHeading(/choose a service/i)).toBeInTheDocument();
  });

  it('refuses to advance from step 1 without a service', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await user.click(continueButton());

    expect(screen.getByText(/step 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/1 problem/i);
  });

  it('moves focus to the error summary after a failed attempt', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await user.click(continueButton());

    // Without this the user is left at the bottom of the form with no idea
    // anything was reported.
    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus());
  });

  it('advances once a service is chosen', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToDetailsStep(user);

    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
    expect(stepHeading(/pet and owner/i)).toBeInTheDocument();
  });

  it('reports every missing field on step 2 at once', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToDetailsStep(user);
    await user.click(continueButton());

    // Pet name, your name, email and phone.
    expect(screen.getByRole('alert')).toHaveTextContent(/4 problems/i);
  });

  it('rejects a malformed email inline, tied to the field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToDetailsStep(user);
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.click(continueButton());

    const email = screen.getByLabelText(/email address/i);
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription(/name@example\.com/i);
  });

  it('clears a field error as soon as it is edited', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToDetailsStep(user);
    await user.click(continueButton());
    expect(screen.getByLabelText(/pet name/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    await user.type(screen.getByLabelText(/pet name/i), 'B');

    // The user should not have to resubmit to learn the problem is fixed.
    expect(screen.getByLabelText(/pet name/i)).not.toHaveAttribute(
      'aria-invalid'
    );
  });

  /**
   * Going back must never validate. Requiring a step to be valid before it can
   * be left would trap anyone who advanced and then wanted to change an
   * earlier answer.
   */
  it('allows going back from a step that has errors', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToDetailsStep(user);
    await user.click(continueButton());
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(stepHeading(/choose a service/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('requires consent before the request can be sent', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToScheduleStep(user);
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: futureDateISO() },
    });
    await user.click(screen.getByRole('button', { name: /send request/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/confirm we can contact/i);
  });
});

describe('Booking page — submission', () => {
  it('reaches the confirmation on a complete request', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToScheduleStep(user);
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: futureDateISO() },
    });
    await user.click(screen.getByLabelText(/you can contact me/i));
    await user.click(screen.getByRole('button', { name: /send request/i }));

    expect(
      await screen.findByRole('heading', { name: /request received/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/PAW-[A-Z0-9]{6}/)).toBeInTheDocument();
  });

  it('moves focus to the confirmation so the outcome is not missed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToScheduleStep(user);
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: futureDateISO() },
    });
    await user.click(screen.getByLabelText(/you can contact me/i));
    await user.click(screen.getByRole('button', { name: /send request/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveFocus());
  });

  it('stores the submitted request and clears the draft', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await goToScheduleStep(user);
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: futureDateISO() },
    });
    await user.click(screen.getByLabelText(/you can contact me/i));
    await user.click(screen.getByRole('button', { name: /send request/i }));

    await screen.findByRole('heading', { name: /request received/i });

    const stored = JSON.parse(window.localStorage.getItem(REQUESTS_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      serviceId: 'grooming',
      petName: 'Bramble',
      email: 'elena@example.com',
    });
    expect(stored[0].reference).toMatch(/^PAW-/);

    // The draft must not survive submission, or the next visitor to this
    // browser starts with someone else's answers.
    expect(window.localStorage.getItem(DRAFT_KEY)).not.toContain('Bramble');
  });
});

describe('Booking page — deep linking and drafts', () => {
  it('pre-selects the service named in the query string', () => {
    renderWithRouter(<Booking />, { route: '/booking?service=boarding' });

    expect(screen.getByRole('radio', { name: /overnight boarding/i })).toBeChecked();
  });

  it('ignores an unknown service in the query string', () => {
    renderWithRouter(<Booking />, { route: '/booking?service=nonsense' });

    screen
      .getAllByRole('radio')
      .forEach((radio) => expect(radio).not.toBeChecked());
  });

  it('shows the chosen service in the running summary', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Booking />);

    await user.click(screen.getByRole('radio', { name: /overnight boarding/i }));

    const summary = screen.getByRole('complementary', { name: /your request/i });
    expect(summary).toHaveTextContent('Overnight Boarding');
    expect(summary).toHaveTextContent('$48');
  });

  it('restores a saved draft on mount', () => {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        serviceId: 'training',
        petName: 'Juno',
        petType: 'dog',
        ownerName: 'Marcus Bell',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: 'morning',
        consent: false,
      })
    );

    renderWithRouter(<Booking />);

    // An accidental refresh must not cost the visitor their answers.
    expect(screen.getByRole('radio', { name: /obedience training/i })).toBeChecked();
    expect(
      screen.getByRole('complementary', { name: /your request/i })
    ).toHaveTextContent('Juno');
  });
});
