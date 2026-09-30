import { useEffect, useId, useState } from 'react';
import { PET_TYPE_FILTERS, resolvePetType } from '../data/pet-types.js';
import styles from './ServiceFilter.module.css';

/**
 * Pet-type filter for the services listing.
 *
 * Two ways to filter, both driving the same state: a text input for anyone
 * who wants to type their pet ("bunny", "hamster") and a pill row of the
 * canonical categories. Typing "bunny" selects the Rabbits pill; clicking
 * Rabbits fills the input with "Rabbits". The pills stay because they double
 * as a legend showing what categories exist.
 *
 * The input is still inside the <fieldset>/<legend> the pills sit in, so
 * screen readers announce the whole control as one group.
 */
export default function ServiceFilter({ value, onChange }) {
  const [input, setInput] = useState('');
  const inputId = useId();

  // Debounced so we don't burn a fetch on every keystroke, and so a partial
  // word like "rab" gets to become "rabbit" before it resolves.
  useEffect(() => {
    const trimmed = input.trim();
    // Skip resolving while empty on first render — the parent already starts
    // at 'all' and we do not want to churn the state before the user types.
    if (!trimmed && value === 'all') return undefined;
    const id = setTimeout(() => onChange(resolvePetType(trimmed)), 200);
    return () => clearTimeout(id);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pill click mirrors back into the input so the two views stay in step.
  const handlePillChange = (event) => {
    const nextValue = event.target.value;
    const option = PET_TYPE_FILTERS.find((o) => o.value === nextValue);
    setInput(option && option.value !== 'all' ? option.label : '');
    onChange(nextValue);
  };

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Filter services by pet</legend>

      <label className={styles.inputLabel} htmlFor={inputId}>
        What's your pet?
      </label>
      <input
        id={inputId}
        type="text"
        className={styles.textInput}
        placeholder="e.g. bunny, hamster, parrot"
        autoComplete="off"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      <div className={styles.options}>
        {PET_TYPE_FILTERS.map((option) => {
          const pillId = `pet-filter-${option.value}`;

          return (
            <div className={styles.option} key={option.value}>
              <input
                className={styles.input}
                type="radio"
                id={pillId}
                name="pet-type"
                value={option.value}
                checked={value === option.value}
                onChange={handlePillChange}
              />
              <label className={styles.label} htmlFor={pillId}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
