import { forwardRef } from 'react';

import Button from './Button.jsx';
import { TIME_LABELS, formatDateLabel } from './BookingSummary.jsx';
import styles from './ConfirmationPanel.module.css';

/**
 * Success state shown after a booking request is submitted.
 *
 * The page moves focus here on submit, so the outcome is the first thing a
 * keyboard or screen-reader user lands on rather than something they have to
 * hunt for. role="status" announces it politely without interrupting.
 */
const ConfirmationPanel = forwardRef(function ConfirmationPanel(
  { reference, service, form, onReset },
  ref
) {
  return (
    <div
      ref={ref}
      className={styles.panel}
      role="status"
      tabIndex={-1}
      aria-labelledby="confirmation-title"
    >
      <span className={styles.icon} aria-hidden="true">
        ✓
      </span>

      <h1 className={styles.title} id="confirmation-title">
        Request received
      </h1>

      <p className={styles.lede}>
        Thanks {form.ownerName.trim().split(' ')[0]} — we have your request for{' '}
        {form.petName}. A member of the team will call or email within one
        business day to confirm the time.
      </p>

      <p className={styles.reference}>
        Your reference
        <strong className={styles.referenceCode}>{reference}</strong>
      </p>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt>Service</dt>
          <dd>{service?.name}</dd>
        </div>
        <div className={styles.detail}>
          <dt>Preferred date</dt>
          <dd>{formatDateLabel(form.preferredDate)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>Preferred time</dt>
          <dd>{TIME_LABELS[form.preferredTime]}</dd>
        </div>
        <div className={styles.detail}>
          <dt>We will contact</dt>
          <dd>
            {form.email} · {form.phone}
          </dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <Button to="/services" variant="secondary">
          Browse more services
        </Button>
        <Button onClick={onReset} variant="ghost">
          Make another request
        </Button>
      </div>
    </div>
  );
});

export default ConfirmationPanel;
