import { Link } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';

/**
 * Breadcrumb trail.
 *
 * Wrapped in a labelled <nav> so it is exposed as a navigation landmark, and
 * the final crumb carries aria-current="page" instead of being a dead link.
 */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className={styles.item} key={item.label}>
              {isLast || !item.to ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link className={styles.link} to={item.to}>
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
