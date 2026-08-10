import { PET_TYPE_FILTERS } from '../data/services.js';
import styles from './ServiceFilter.module.css';

/**
 * Pet-type filter for the services listing.
 *
 * Built from a real <fieldset>/<legend> with radio inputs rather than styled
 * buttons. That buys correct grouping semantics, arrow-key navigation and
 * "3 of 3" position announcements from the browser at no cost. Each input has
 * an associated <label>; the pill appearance is purely CSS.
 */
export default function ServiceFilter({ value, onChange }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Filter services by pet</legend>

      <div className={styles.options}>
        {PET_TYPE_FILTERS.map((option) => {
          const inputId = `pet-filter-${option.value}`;

          return (
            <div className={styles.option} key={option.value}>
              <input
                className={styles.input}
                type="radio"
                id={inputId}
                name="pet-type"
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
              />
              <label className={styles.label} htmlFor={inputId}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
