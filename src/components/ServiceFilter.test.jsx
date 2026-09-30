import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ServiceFilter from './ServiceFilter.jsx';
import { PET_TYPE_FILTERS } from '../data/pet-types.js';

describe('ServiceFilter', () => {
  it('is grouped as a labelled set of radios, not loose buttons', () => {
    render(<ServiceFilter value="all" onChange={() => {}} />);

    // A real fieldset/legend gives grouping semantics and arrow-key movement
    // between options for free.
    expect(
      screen.getByRole('group', { name: /filter services by pet/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(PET_TYPE_FILTERS.length);
  });

  it('gives every option a visible, associated label', () => {
    render(<ServiceFilter value="all" onChange={() => {}} />);

    expect(screen.getByLabelText('All pets')).toBeInTheDocument();
    expect(screen.getByLabelText('Dogs')).toBeInTheDocument();
    expect(screen.getByLabelText('Cats')).toBeInTheDocument();
    expect(screen.getByLabelText('Rabbits')).toBeInTheDocument();
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

    // The text input takes the first tab stop; the radio group takes the next.
    await user.tab();
    expect(screen.getByLabelText(/what's your pet/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('All pets')).toHaveFocus();

    // Arrow-key movement inside a radio group is browser behaviour that comes
    // from using real inputs — it is not implemented by hand anywhere.
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('dog');
  });

  it('keeps the pill group to a single tab stop', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ServiceFilter value="all" onChange={() => {}} />
        <button type="button">After</button>
      </>
    );

    // Two stops belong to the filter — the text input and the pill group —
    // then focus leaves for the next control on the page.
    await user.tab();
    expect(screen.getByLabelText(/what's your pet/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('All pets')).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});
