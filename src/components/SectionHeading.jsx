import styles from './SectionHeading.module.css';

/**
 * Consistent section header.
 *
 * `as` lets a caller pick the right heading rank for its position in the
 * document outline, so styling never dictates the heading hierarchy.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  align = 'left',
  id,
}) {
  return (
    <div className={`${styles.wrapper} ${styles[align]}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
