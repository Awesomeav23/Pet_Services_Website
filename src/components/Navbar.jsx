import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { NAV_LINKS } from '../data/navigation.js';
import styles from './Navbar.module.css';

/**
 * Primary site navigation.
 *
 * Accessibility behaviour worth noting:
 * - the mobile trigger is a real <button> with aria-expanded/aria-controls
 * - Escape closes the panel and returns focus to the trigger
 * - NavLink sets aria-current="page", so the active section is announced
 *   rather than only shown with colour
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  // Escape closes the panel and hands focus back to the control that opened it.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        {/* Navigating closes the mobile panel. Handled on the links themselves
            rather than in an effect on the route, which would cause a second
            render pass on every navigation. */}
        <NavLink
          to="/"
          className={styles.brand}
          onClick={() => setIsMenuOpen(false)}
        >
          <span className={styles.brandMark} aria-hidden="true">
            🐾
          </span>
          <span className={styles.brandText}>
            Pawsome
            <span className={styles.brandTextSoft}>Pet Services</span>
          </span>
        </NavLink>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className={styles.toggleIcon} aria-hidden="true">
            {isMenuOpen ? '✕' : '☰'}
          </span>
          {isMenuOpen ? 'Close menu' : 'Menu'}
        </button>

        <nav
          id="primary-navigation"
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
          aria-label="Primary"
        >
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={linkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
