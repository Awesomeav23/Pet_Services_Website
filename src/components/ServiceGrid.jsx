import ServiceCard from './ServiceCard.jsx';
import styles from './ServiceGrid.module.css';

/**
 * Responsive grid of service cards.
 *
 * Rendered as a list so assistive technology announces how many services are
 * in the set before reading them out.
 */
export default function ServiceGrid({ services, label }) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {services.map((service) => (
        <li className={styles.item} key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
