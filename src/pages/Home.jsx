import Hero from '../components/Hero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceGrid from '../components/ServiceGrid.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import Button from '../components/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { getPopularServices } from '../data/services.js';
import { getFeaturedTestimonials } from '../data/testimonials.js';
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

  const popularServices = getPopularServices();
  const featuredTestimonials = getFeaturedTestimonials();

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="popular-title">
        <div className="container">
          <SectionHeading
            eyebrow="Most requested"
            title="Where most owners start"
            description="Three services book out first each week. Browse the full list to see everything we offer."
            id="popular-title"
          />
          <ServiceGrid services={popularServices} label="Popular services" />
          <div className={styles.popularAction}>
            <Button to="/services" variant="secondary">
              View all seven services
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="how-it-works-title">
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

      <section className="section" aria-labelledby="reviews-title">
        <div className="container">
          <SectionHeading
            eyebrow="Owner reviews"
            title="Why owners stay with us"
            description="A few words from people whose pets we see every week."
            id="reviews-title"
            align="center"
          />
          <ul className={styles.reviews}>
            {featuredTestimonials.map((testimonial) => (
              <li className={styles.reviewItem} key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
          <div className={styles.popularAction}>
            <Button to="/about" variant="ghost">
              Read more reviews
            </Button>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-title">
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
