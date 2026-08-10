import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ServiceFilter from './ServiceFilter.jsx';

describe('ServiceFilter', () => {
  it('is grouped as a labelled set of radios, not loose buttons', () => {
    render(<ServiceFilter value="all" onChange={() => {}} />);

    // A real fieldset/legend gives grouping semantics and arrow-key movement
    // between options for free.
    expect(
      screen.getByRole('group', { name: /filter services by pet/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('gives every option a visible, associated label', () => {
    render(<ServiceFilter value="all" onChange={() => {}} />);

    expect(screen.getByLabelText('All pets')).toBeInTheDocument();
    expect(screen.getByLabelText('Dogs')).toBeInTheDocument();
    expect(screen.getByLabelText('Cats')).toBeInTheDocument();
  });

  it('reflects the current selection', () => {
    render(<ServiceFilter value="cat" onChange={() => {}} />);

    expect(screen.getByLabelText('Cats')).toBeChecked();
    expect(screen.getByLabelText('Dogs')).not.toBeChecked();
    expect(screen.getByLabelText('All pets')).not.toBeChecked();
  });

  it('reports the chosen value to the caller', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ServiceFilter value="all" onChange={onChange} />);

    await user.click(screen.getByLabelText('Dogs'));

    expect(onChange).toHaveBeenCalledWith('dog');
  });

  it('is operable from the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ServiceFilter value="all" onChange={onChange} />);

    await user.tab();
    expect(screen.getByLabelText('All pets')).toHaveFocus();

    // Arrow-key movement inside a radio group is browser behaviour that comes
    // from using real inputs — it is not implemented by hand anywhere.
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('dog');
  });

  it('takes a single tab stop for the whole group', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ServiceFilter value="all" onChange={() => {}} />
        <button type="button">After</button>
      </>
    );

    await user.tab();
    expect(screen.getByLabelText('All pets')).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});
