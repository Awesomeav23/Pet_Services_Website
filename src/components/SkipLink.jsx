import styles from './SkipLink.module.css';

/**
 * First focusable element on the page. Hidden until focused, it lets keyboard
 * users jump past the navigation straight to the page content.
 */
export default function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main-content">
      Skip to main content
    </a>
  );
}
