import { forwardRef } from 'react';

import styles from './ErrorSummary.module.css';

/**
 * Error summary shown above a form after a failed submit.
 *
 * Two things make this work for keyboard and screen-reader users: the page
 * moves focus here on failure (hence forwardRef and tabIndex={-1}), and each
 * entry is an in-page link to the offending control, so a long form does not
 * have to be re-read to find what went wrong.
 *
 * role="alert" makes the summary announce itself as soon as it appears.
 */
const ErrorSummary = forwardRef(function ErrorSummary({ errors, fieldLabels }, ref) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;

  return (
    <div
      ref={ref}
      className={styles.summary}
      role="alert"
      tabIndex={-1}
      aria-labelledby="error-summary-title"
    >
      <h2 className={styles.title} id="error-summary-title">
        {entries.length === 1
          ? 'There is 1 problem with this form'
          : `There are ${entries.length} problems with this form`}
      </h2>

      <ul className={styles.list}>
        {entries.map(([field, message]) => (
          <li key={field}>
            <a className={styles.link} href={`#${field}`}>
              <span className="visually-hidden">
                {fieldLabels?.[field] ?? field}:{' '}
              </span>
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ErrorSummary;
