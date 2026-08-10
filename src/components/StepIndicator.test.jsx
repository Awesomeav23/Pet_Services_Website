import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import StepIndicator from './StepIndicator.jsx';

const STEPS = ['Choose a service', 'Pet and owner', 'Date and time'];

describe('StepIndicator', () => {
  it('is exposed as a labelled navigation landmark', () => {
    render(<StepIndicator steps={STEPS} currentStep={0} />);
    expect(
      screen.getByRole('navigation', { name: /booking progress/i })
    ).toBeInTheDocument();
  });

  it('states the position in words, not just as a highlighted dot', () => {
    render(<StepIndicator steps={STEPS} currentStep={1} />);
    expect(screen.getByText(/step 2 of 3/i)).toBeInTheDocument();
  });

  it('marks only the active step with aria-current', () => {
    render(<StepIndicator steps={STEPS} currentStep={1} />);

    const items = screen.getAllByRole('listitem');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('announces completed steps in text rather than by a tick glyph alone', () => {
    render(<StepIndicator steps={STEPS} currentStep={2} />);

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent(/completed/i);
    expect(items[1]).toHaveTextContent(/completed/i);
    expect(items[2]).not.toHaveTextContent(/completed/i);
  });

  it('renders the steps in order as a list', () => {
    render(<StepIndicator steps={STEPS} currentStep={0} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Choose a service');
    expect(items[2]).toHaveTextContent('Date and time');
  });
});
