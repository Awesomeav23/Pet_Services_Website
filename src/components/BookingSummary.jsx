import PriceBadge from './PriceBadge.jsx';
import { formatDuration } from '../utils/format.js';
import styles from './BookingSummary.module.css';

const TIME_LABELS = {
  morning: 'Morning (7am – 12pm)',
  afternoon: 'Afternoon (12pm – 4pm)',
  evening: 'Evening (4pm – 7pm)',
};

/** "2026-08-14" -> "Friday, 14 August 2026" */
const formatDateLabel = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Running recap of the booking choices.
 *
 * A description list, so each label is programmatically tied to its value
 * instead of merely sitting next to it. Rows only appear once the user has
 * supplied that detail, keeping the panel honest about what is filled in.
 */
export default function BookingSummary({ service, form }) {
  const rows = [
    service && { label: 'Service', value: service.name },
    service && { label: 'Typical length', value: formatDuration(service.duration) },
    form.petName && { label: 'Pet', value: form.petName },
    form.ownerName && { label: 'Owner', value: form.ownerName },
    form.preferredDate && {
      label: 'Preferred date',
      value: formatDateLabel(form.preferredDate),
    },
    form.preferredTime && {
      label: 'Preferred time',
      value: TIME_LABELS[form.preferredTime],
    },
  ].filter(Boolean);

  return (
    <aside className={styles.panel} aria-labelledby="booking-summary-title">
      <h2 className={styles.title} id="booking-summary-title">
        Your request
      </h2>

      {service ? (
        <PriceBadge amount={service.price} unit={service.priceUnit} size="lg" />
      ) : (
        <p className={styles.empty}>
          Choose a service and the estimated price will appear here.
        </p>
      )}

      {rows.length > 0 && (
        <dl className={styles.rows}>
          {rows.map(({ label, value }) => (
            <div className={styles.row} key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className={styles.note}>
        This is a request, not a confirmed booking. No payment is taken online —
        we check availability and reply within one business day.
      </p>
    </aside>
  );
}

export { TIME_LABELS, formatDateLabel };
