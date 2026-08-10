import { Link } from 'react-router-dom';

import PriceBadge from './PriceBadge.jsx';
import { PET_TYPE_LABELS } from '../data/services.js';
import { formatDuration } from '../utils/format.js';
import styles from './ServiceCard.module.css';

/**
 * Summary card for a single service.
 *
 * The whole card is clickable, but there is exactly one link in the markup —
 * the heading link, stretched over the card with a pseudo-element. That keeps
 * the tab order to one stop per card and gives the link a unique accessible
 * name (the service name) instead of seven identical "Learn more" links.
 */
export default function ServiceCard({ service }) {
  const { id, name, tagline, price, priceUnit, duration, petTypes, icon, popular } =
    service;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        {popular && <span className={styles.popular}>Most requested</span>}
      </div>

      <h3 className={styles.title}>
        <Link to={`/services/${id}`} className={styles.titleLink}>
          {name}
          <span className="visually-hidden"> — view service details</span>
        </Link>
      </h3>

      <p className={styles.tagline}>{tagline}</p>

      <ul className={styles.tags}>
        {petTypes.map((petType) => (
          <li className={styles.tag} key={petType}>
            {PET_TYPE_LABELS[petType]}
          </li>
        ))}
        <li className={styles.tag}>{formatDuration(duration)}</li>
      </ul>

      <div className={styles.footer}>
        <PriceBadge amount={price} unit={priceUnit} />
        <span className={styles.cue} aria-hidden="true">
          View details →
        </span>
      </div>
    </article>
  );
}
