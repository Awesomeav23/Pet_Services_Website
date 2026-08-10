import Button from './Button.jsx';
import styles from './Hero.module.css';

const HIGHLIGHTS = [
  { value: '11 yrs', label: 'Caring for local pets' },
  { value: '7', label: 'Service categories' },
  { value: '4.9★', label: 'Average owner rating' },
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Springfield, IL</p>
          <h1 id="hero-title" className={styles.title}>
            Care your pet actually looks forward to
          </h1>
          <p className={styles.lede}>
            Grooming, boarding, daycare, walking and wellness visits under one
            roof — with the same small team every time, so your dog or cat is
            never handed to a stranger.
          </p>

          <div className={styles.actions}>
            <Button to="/booking" size="lg">
              Request an appointment
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              Browse services
            </Button>
          </div>

          <dl className={styles.highlights}>
            {HIGHLIGHTS.map(({ value, label }) => (
              <div className={styles.highlight} key={label}>
                <dt className={styles.highlightValue}>{value}</dt>
                <dd className={styles.highlightLabel}>{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Decorative only — the surrounding copy already conveys the message,
            so this is hidden from assistive technology. */}
        <div className={styles.art} aria-hidden="true">
          <span className={styles.artPaw}>🐕</span>
          <span className={styles.artPawSmall}>🐈</span>
        </div>
      </div>
    </section>
  );
}
