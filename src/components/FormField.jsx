import styles from './FormField.module.css';

/**
 * Labelled form control with hint and error text.
 *
 * Every control gets a real <label htmlFor>, never a placeholder standing in
 * for one — placeholders vanish on typing and are skipped by some screen
 * readers. Hint and error text are joined into aria-describedby so both are
 * announced with the field, and aria-invalid marks the failing control.
 *
 * `as` switches between input, textarea and select while keeping the same
 * labelling and error wiring.
 */
export default function FormField({
  id,
  label,
  error,
  hint,
  required = false,
  as = 'input',
  children,
  ...inputProps
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const sharedProps = {
    id,
    name: id,
    className: `${styles.control} ${error ? styles.controlError : ''}`,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    required,
    ...inputProps,
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {/* Spelled out rather than relying on a red asterisk alone. */}
        {required ? (
          <span className={styles.required}> (required)</span>
        ) : (
          <span className={styles.optional}> (optional)</span>
        )}
      </label>

      {hint && (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      )}

      {as === 'textarea' && <textarea rows={4} {...sharedProps} />}
      {as === 'select' && <select {...sharedProps}>{children}</select>}
      {as === 'input' && <input {...sharedProps} />}

      {error && (
        <p className={styles.error} id={errorId}>
          <span className={styles.errorIcon} aria-hidden="true">
            !
          </span>
          {error}
        </p>
      )}
    </div>
  );
}
