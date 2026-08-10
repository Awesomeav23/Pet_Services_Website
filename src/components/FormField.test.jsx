import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormField from './FormField.jsx';

describe('FormField', () => {
  it('associates the label with the control, so clicking it focuses the input', async () => {
    const user = userEvent.setup();
    render(<FormField id="petName" label="Pet name" />);

    // getByLabelText only finds the input if the association is real.
    const input = screen.getByLabelText(/pet name/i);
    await user.click(screen.getByText(/pet name/i));

    expect(input).toHaveFocus();
  });

  it('states required and optional in text rather than relying on an asterisk', () => {
    const { rerender } = render(
      <FormField id="petName" label="Pet name" required />
    );
    expect(screen.getByText(/\(required\)/i)).toBeInTheDocument();

    rerender(<FormField id="petBreed" label="Breed" />);
    expect(screen.getByText(/\(optional\)/i)).toBeInTheDocument();
  });

  it('describes the control with its hint', () => {
    render(
      <FormField id="phone" label="Phone number" hint="Ten digits, please." />
    );

    expect(screen.getByLabelText(/phone number/i)).toHaveAccessibleDescription(
      /ten digits, please/i
    );
  });

  it('marks the control invalid and describes it with the error', () => {
    render(
      <FormField id="email" label="Email address" error="Email is required" />
    );

    const input = screen.getByLabelText(/email address/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/email is required/i);
  });

  it('joins hint and error together, so neither is lost when both are present', () => {
    render(
      <FormField
        id="phone"
        label="Phone number"
        hint="Ten digits, please."
        error="Enter a 10-digit phone number"
      />
    );

    const description = screen
      .getByLabelText(/phone number/i)
      .getAttribute('aria-describedby');

    expect(description).toContain('phone-hint');
    expect(description).toContain('phone-error');
  });

  it('leaves aria-invalid off entirely when the field is valid', () => {
    render(<FormField id="petName" label="Pet name" />);
    expect(screen.getByLabelText(/pet name/i)).not.toHaveAttribute(
      'aria-invalid'
    );
  });

  it('renders a textarea when asked', () => {
    render(<FormField id="petNotes" label="Notes" as="textarea" />);
    expect(screen.getByLabelText(/notes/i).tagName).toBe('TEXTAREA');
  });

  it('renders a select with its options when asked', () => {
    render(
      <FormField id="petType" label="Pet type" as="select" defaultValue="dog">
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </FormField>
    );

    const select = screen.getByLabelText(/pet type/i);
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'Cat' })).toBeInTheDocument();
  });

  it('passes typing through to the caller', async () => {
    const user = userEvent.setup();
    let value = '';
    render(
      <FormField
        id="petName"
        label="Pet name"
        value={value}
        onChange={(event) => {
          value = event.target.value;
        }}
      />
    );

    await user.type(screen.getByLabelText(/pet name/i), 'B');
    expect(value).toBe('B');
  });
});
