import { Link } from 'react-router-dom';

import { NAV_LINKS, CONTACT_DETAILS } from '../data/navigation.js';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const { phone, phoneHref, email, emailHref, addressLines, hours } =
    CONTACT_DETAILS;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.brand}>
            <span aria-hidden="true">🐾</span> Pawsome Pet Services
          </p>
          <p className={styles.blurb}>
            Neighbourhood pet care since 2014 — grooming, boarding, daycare and
            everything in between, run by people who know your pet by name.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.heading}>Explore</h2>
          <ul className={styles.list}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link className={styles.link} to={to}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.heading}>Get in touch</h2>
          <ul className={styles.list}>
            <li>
              <a className={styles.link} href={phoneHref}>
                {phone}
              </a>
            </li>
            <li>
              <a className={styles.link} href={emailHref}>
                {email}
              </a>
            </li>
          </ul>
          <address className={styles.address}>
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>

        <div>
          <h2 className={styles.heading}>Opening hours</h2>
          <dl className={styles.hours}>
            {hours.map(({ days, time }) => (
              <div className={styles.hoursRow} key={days}>
                <dt>{days}</dt>
                <dd>{time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`container ${styles.legal}`}>
        <p>© {year} Pawsome Pet Services. Demo project — not a real business.</p>
      </div>
    </footer>
  );
}
