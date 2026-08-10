import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import ErrorSummary from './ErrorSummary.jsx';

const FIELD_LABELS = {
  petName: 'Pet name',
  email: 'Email address',
};

describe('ErrorSummary', () => {
  it('renders nothing when there are no errors', () => {
    const { container } = render(<ErrorSummary errors={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('announces itself as an alert so it is read as soon as it appears', () => {
    render(<ErrorSummary errors={{ petName: 'Pet name is required' }} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses the singular for one problem', () => {
    render(<ErrorSummary errors={{ petName: 'Pet name is required' }} />);
    expect(
      screen.getByRole('heading', { name: /there is 1 problem/i })
    ).toBeInTheDocument();
  });

  it('uses the plural and the correct count for several problems', () => {
    render(
      <ErrorSummary
        errors={{
          petName: 'Pet name is required',
          email: 'Email address is required',
        }}
      />
    );

    expect(
      screen.getByRole('heading', { name: /there are 2 problems/i })
    ).toBeInTheDocument();
  });

  it('links each entry to the control it refers to', () => {
    render(
      <ErrorSummary
        errors={{ email: 'Email address is required' }}
        fieldLabels={FIELD_LABELS}
      />
    );

    // The link must point at the field id, or the summary is decorative.
    const link = screen.getByRole('link', { name: /email address is required/i });
    expect(link).toHaveAttribute('href', '#email');
  });

  it('prefixes each message with its field name for screen reader users', () => {
    render(
      <ErrorSummary
        errors={{ email: 'Email address is required' }}
        fieldLabels={FIELD_LABELS}
      />
    );

    // The visible text is the message; the accessible name carries the field
    // name too. The whitespace is loose because the accessible-name algorithm
    // trims each text node before joining them, so the space after the colon
    // is dropped — "Email address:Email address is required".
    expect(
      screen.getByRole('link', {
        name: /email address:\s*email address is required/i,
      })
    ).toBeInTheDocument();
  });

  it('falls back to the field key when no label is supplied', () => {
    render(<ErrorSummary errors={{ consent: 'Please confirm' }} />);
    expect(
      screen.getByRole('link', { name: /consent:\s*please confirm/i })
    ).toBeInTheDocument();
  });

  it('exposes a ref so the page can move focus here after a failed submit', () => {
    const ref = createRef();
    render(<ErrorSummary ref={ref} errors={{ petName: 'Required' }} />);

    ref.current.focus();
    expect(ref.current).toHaveFocus();
    // tabIndex -1 keeps it focusable programmatically without adding a tab stop.
    expect(ref.current).toHaveAttribute('tabindex', '-1');
  });
});
