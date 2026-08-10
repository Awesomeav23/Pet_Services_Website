import SectionHeading from '../components/SectionHeading.jsx';
import TeamMemberCard from '../components/TeamMemberCard.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import Button from '../components/Button.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { TEAM } from '../data/team.js';
import { TESTIMONIALS } from '../data/testimonials.js';
import { FAQS } from '../data/faqs.js';
import styles from './About.module.css';

const VALUES = [
  {
    title: 'One team, every visit',
    body: 'Your pet sees the same handful of faces each time. We staff for continuity rather than capacity, which is why we cap how many animals we take.',
  },
  {
    title: 'Force-free throughout',
    body: 'No prong collars, no scruffing, no sedation for convenience. If an animal is not coping we stop, and you are not charged for a visit we cut short.',
  },
  {
    title: 'You get told the truth',
    body: 'If your dog had a bad day at daycare, or we spot something that needs a vet, you hear it the same day — not on the fifth visit.',
  },
];

export default function About() {
  useDocumentTitle('About');

  return (
    <>
      <section className="section container">
        <SectionHeading
          as="h1"
          eyebrow="About us"
          title="A small shop that stayed small on purpose"
          description="Pawsome has been looking after Springfield’s pets since 2014. We have turned down two expansion offers because getting bigger would mean your pet meeting more strangers."
        />

        <div className={styles.values}>
          {VALUES.map(({ title, body }) => (
            <div className={styles.value} key={title}>
              <h2 className={styles.valueTitle}>{title}</h2>
              <p className={styles.valueBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="team-title">
        <div className="container">
          <SectionHeading
            eyebrow="The team"
            title="Who will be handling your pet"
            description="Four people, all employed in-house. No contractors and no rotating agency staff."
            id="team-title"
          />

          <ul className={styles.teamGrid}>
            {TEAM.map((member) => (
              <li className={styles.teamItem} key={member.id}>
                <TeamMemberCard member={member} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="reviews-title">
        <div className="container">
          <SectionHeading
            eyebrow="Owner reviews"
            title="What local owners say"
            id="reviews-title"
          />

          <ul className={styles.reviewGrid}>
            {TESTIMONIALS.map((testimonial) => (
              <li className={styles.reviewItem} key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="faq-title">
        <div className="container">
          <SectionHeading
            eyebrow="Questions"
            title="Things owners ask before booking"
            id="faq-title"
          />

          <FaqAccordion items={FAQS} />

          <div className={styles.faqFooter}>
            <p className={styles.faqNote}>Still not sure about something?</p>
            <Button to="/contact" variant="secondary">
              Ask us directly
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
