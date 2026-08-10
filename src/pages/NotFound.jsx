import Button from '../components/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import styles from './NotFound.module.css';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <section className={`section container ${styles.wrapper}`}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1>We could not find that page</h1>
      <p className={styles.body}>
        The link may be out of date, or the page may have moved. Try starting
        from the home page or head straight to our services.
      </p>
      <div className={styles.actions}>
        <Button to="/">Back to home</Button>
        <Button to="/services" variant="secondary">
          View services
        </Button>
      </div>
    </section>
  );
}
