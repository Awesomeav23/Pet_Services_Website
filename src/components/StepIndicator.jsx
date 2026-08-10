import styles from './StepIndicator.module.css';

/**
 * Progress through the booking steps.
 *
 * Presented as an ordered list inside a labelled nav so the sequence is
 * conveyed structurally. aria-current marks the active step, and completed
 * steps carry visually hidden status text so progress is not communicated by
 * colour and a tick glyph alone.
 */
export default function StepIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Booking progress" className={styles.wrapper}>
      <p className={styles.counter}>
        Step {currentStep + 1} of {steps.length}
      </p>

      <ol className={styles.list}>
        {steps.map((label, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          const stateClass = isCurrent
            ? styles.current
            : isComplete
              ? styles.complete
              : styles.upcoming;

          return (
            <li
              key={label}
              className={`${styles.step} ${stateClass}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={styles.marker} aria-hidden="true">
                {isComplete ? '✓' : index + 1}
              </span>
              <span className={styles.label}>
                {label}
                {isComplete && <span className="visually-hidden"> (completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
