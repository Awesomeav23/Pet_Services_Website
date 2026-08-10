import { useMemo, useState } from 'react';

import SectionHeading from '../components/SectionHeading.jsx';
import ServiceFilter from '../components/ServiceFilter.jsx';
import ServiceGrid from '../components/ServiceGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { filterServicesByPetType, PET_TYPE_FILTERS } from '../data/services.js';
import { pluralize } from '../utils/format.js';
import styles from './Services.module.css';

export default function Services() {
  useDocumentTitle('Services');

  const [petType, setPetType] = useState('all');

  const visibleServices = useMemo(
    () => filterServicesByPetType(petType),
    [petType]
  );

  const activeFilterLabel = PET_TYPE_FILTERS.find(
    (option) => option.value === petType
  )?.label;

  return (
    <section className="section container">
      <SectionHeading
        as="h1"
        eyebrow="What we offer"
        title="Seven ways to look after your pet"
        description="Every service is run by the same in-house team — no contractors, no rotating faces. Filter by pet to see what applies to yours."
      />

      <div className={styles.toolbar}>
        <ServiceFilter value={petType} onChange={setPetType} />

        {/* Announced politely so filtering is reported to screen-reader users,
            who would otherwise get no feedback that the grid changed. */}
        <p className={styles.count} role="status" aria-live="polite">
          {pluralize(visibleServices.length, 'service')} shown
          {petType !== 'all' && ` for ${activeFilterLabel?.toLowerCase()}`}
        </p>
      </div>

      {visibleServices.length > 0 ? (
        <ServiceGrid services={visibleServices} label="Available services" />
      ) : (
        <EmptyState
          title="No services match that filter"
          description="We do not currently offer a service for that pet type. Try viewing all pets instead."
          actionLabel="Show all services"
          onAction={() => setPetType('all')}
        />
      )}
    </section>
  );
}
