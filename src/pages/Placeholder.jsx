import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import styles from './Placeholder.module.css';

/**
 * Temporary stand-in for sections that are still being built.
 *
 * Keeping every nav destination routable means the header, footer and skip
 * link can all be exercised now; each of these routes is replaced by its real
 * page as that section lands.
 */
export default function Placeholder({ title, description }) {
  useDocumentTitle(title);

  return (
    <section className={`section container ${styles.wrapper}`}>
      <SectionHeading
        as="h1"
        eyebrow="Coming soon"
        title={title}
        description={description}
        align="center"
      />
      <Button to="/" variant="secondary">
        Back to home
      </Button>
    </section>
  );
}
