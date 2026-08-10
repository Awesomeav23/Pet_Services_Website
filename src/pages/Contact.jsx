import SectionHeading from '../components/SectionHeading.jsx';
import ContactForm from '../components/ContactForm.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { CONTACT_DETAILS } from '../data/navigation.js';
import styles from './Contact.module.css';

export default function Contact() {
  useDocumentTitle('Contact');

  const { phone, phoneHref, email, emailHref, addressLines, hours } =
    CONTACT_DETAILS;

  return (
    <section className="section container">
      <SectionHeading
        as="h1"
        eyebrow="Get in touch"
        title="Talk to a person, not a chatbot"
        description="Call during opening hours and someone on the floor picks up. Outside hours, send a message and we reply within one business day."
      />

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <h2 className={styles.columnHeading}>Send us a message</h2>
          <ContactForm />
        </div>

        <div className={styles.detailsColumn}>
          <div className={styles.card}>
            <h2 className={styles.columnHeading}>Contact details</h2>

            <dl className={styles.details}>
              <div className={styles.detail}>
                <dt>Phone</dt>
                <dd>
                  <a href={phoneHref}>{phone}</a>
                </dd>
              </div>
              <div className={styles.detail}>
                <dt>Email</dt>
                <dd>
                  <a href={emailHref}>{email}</a>
                </dd>
              </div>
              <div className={styles.detail}>
                <dt>Address</dt>
                <dd>
                  <address className={styles.address}>
                    {addressLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.card}>
            <h2 className={styles.columnHeading}>Opening hours</h2>

            {/* Genuine tabular data, so a real table with scoped headers —
                each cell is then announced with the day it belongs to. */}
            <table className={styles.hours}>
              <caption className="visually-hidden">
                Opening hours by day of the week
              </caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Hours</th>
                </tr>
              </thead>
              <tbody>
                {hours.map(({ days, time }) => (
                  <tr key={days}>
                    <th scope="row">{days}</th>
                    <td>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className={styles.note}>
              Drop-in facility tours run weekday afternoons, 2pm – 4pm. No
              appointment needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
