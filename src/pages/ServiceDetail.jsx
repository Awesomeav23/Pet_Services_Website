import { useParams } from 'react-router-dom';

import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Button from '../components/Button.jsx';
import PriceBadge from '../components/PriceBadge.jsx';
import ServiceGrid from '../components/ServiceGrid.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import NotFound from './NotFound.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import {
  getServiceById,
  SERVICES,
  PET_TYPE_LABELS,
} from '../data/services.js';
import { formatDuration, formatList } from '../utils/format.js';
import styles from './ServiceDetail.module.css';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const service = getServiceById(serviceId);

  // A bad or stale URL must not crash the route; fall through to the 404 page.
  useDocumentTitle(service ? service.name : 'Page not found');
  if (!service) return <NotFound />;

  const {
    id,
    name,
    tagline,
    description,
    price,
    priceUnit,
    duration,
    petTypes,
    icon,
    includes,
  } = service;

  const relatedServices = SERVICES.filter(
    (item) => item.id !== id && item.petTypes.some((p) => petTypes.includes(p))
  ).slice(0, 3);

  const petLabels = petTypes.map((petType) => PET_TYPE_LABELS[petType]);

  return (
    <>
      <section className="section container">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: name },
          ]}
        />

        <div className={styles.layout}>
          <div className={styles.main}>
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
            <h1>{name}</h1>
            <p className={styles.tagline}>{tagline}</p>
            <p className={styles.description}>{description}</p>

            <h2 className={styles.includesHeading}>What is included</h2>
            <ul className={styles.includes}>
              {includes.map((item) => (
                <li className={styles.includesItem} key={item}>
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Key facts repeated as a description list so the pairing between
              label and value is programmatically clear, not just visual. */}
          <aside className={styles.aside} aria-labelledby="service-summary">
            <h2 id="service-summary" className={styles.asideHeading}>
              At a glance
            </h2>

            <PriceBadge amount={price} unit={priceUnit} size="lg" />

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Typical length</dt>
                <dd>{formatDuration(duration)}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Suitable for</dt>
                <dd>{formatList(petLabels)}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Booking</dt>
                <dd>Request online, confirmed within one business day</dd>
              </div>
            </dl>

            {/* Deep link so the booking form opens with this service chosen. */}
            <Button to={`/booking?service=${id}`} fullWidth>
              Book {name}
            </Button>
            <p className={styles.asideNote}>
              No payment is taken online. We confirm availability first.
            </p>
          </aside>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="section section--tint" aria-labelledby="related-title">
          <div className="container">
            <SectionHeading
              title="You might also need"
              id="related-title"
              eyebrow="Related services"
            />
            <ServiceGrid services={relatedServices} label="Related services" />
          </div>
        </section>
      )}
    </>
  );
}
