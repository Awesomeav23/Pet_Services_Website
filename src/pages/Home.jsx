import Hero from '../components/Hero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import styles from './Home.module.css';

const STEPS = [
  {
    number: 1,
    title: 'Tell us about your pet',
    body: 'Share their name, breed, age and anything we should know — anxious around clippers, hates the bath, loves everyone.',
  },
  {
    number: 2,
    title: 'Pick a service and a time',
    body: 'Choose from grooming, boarding, daycare, walking, training, wellness or pet taxi, then send us a preferred date.',
  },
  {
    number: 3,
    title: 'We confirm within a day',
    body: 'A real person reviews the request, checks availability and replies by phone or email within one business day.',
  },
];

export default function Home() {
  useDocumentTitle('Home');

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="how-it-works-title">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="Booking takes about two minutes"
            description="No accounts, no deposit, no phone tag. Send a request and we handle the rest."
            id="how-it-works-title"
            align="center"
          />

          <ol className={styles.steps}>
            {STEPS.map(({ number, title, body }) => (
              <li className={styles.step} key={number}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {number}
                </span>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepBody}>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="cta-title">
        <div className={`container ${styles.cta}`}>
          <SectionHeading
            title="Ready when your pet is"
            description="Same-day slots often open up. Send a request and we will let you know what is free this week."
            id="cta-title"
            align="center"
          />
          <Button to="/booking" size="lg">
            Request an appointment
          </Button>
        </div>
      </section>
    </>
  );
}
