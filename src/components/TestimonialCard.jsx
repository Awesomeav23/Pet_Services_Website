import styles from './TestimonialCard.module.css';

const MAX_RATING = 5;

/**
 * Owner review.
 *
 * Marked up as a blockquote with its attribution in a <figcaption>, which is
 * the correct pairing for a quote and its source.
 *
 * The star row is decorative: the rating is also stated as text ("5 out of 5")
 * for screen readers, so meaning never depends on the glyphs rendering.
 */
export default function TestimonialCard({ testimonial }) {
  const { quote, author, petName, rating, service } = testimonial;

  return (
    <figure className={styles.card}>
      <p className={styles.rating}>
        <span className={styles.stars} aria-hidden="true">
          {'★'.repeat(rating)}
          {'☆'.repeat(MAX_RATING - rating)}
        </span>
        <span className="visually-hidden">
          Rated {rating} out of {MAX_RATING}
        </span>
      </p>

      <blockquote className={styles.quote}>
        <p>{quote}</p>
      </blockquote>

      <figcaption className={styles.attribution}>
        <cite className={styles.author}>{author}</cite>
        <span className={styles.pet}>{petName}</span>
        <span className={styles.service}>{service}</span>
      </figcaption>
    </figure>
  );
}
