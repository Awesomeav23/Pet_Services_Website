import { formatPrice } from '../utils/format.js';
import styles from './PriceBadge.module.css';

/**
 * Price + unit, rendered the same way on cards and detail pages.
 *
 * The amount and its unit are wrapped together so a screen reader announces
 * "55 dollars per visit" rather than a bare number.
 */
export default function PriceBadge({ amount, unit, size = 'md' }) {
  return (
    <p className={`${styles.badge} ${styles[size]}`}>
      <span className={styles.amount}>{formatPrice(amount)}</span>
      <span className={styles.unit}>{unit}</span>
    </p>
  );
}
