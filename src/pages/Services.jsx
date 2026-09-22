import { useCallback, useState } from 'react';

import SectionHeading from '../components/SectionHeading.jsx';
import ServiceFilter from '../components/ServiceFilter.jsx';
import ServiceGrid from '../components/ServiceGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { fetchServices } from '../api/client.js';
import useAsync from '../hooks/useAsync.js';
import { PET_TYPE_FILTERS } from '../data/pet-types.js';
import { pluralize } from '../utils/format.js';
import styles from './Services.module.css';

export default function Services() {
  useDocumentTitle('Services');

  const [petType, setPetType] = useState('all');

  // Filtering happens in SQL, so changing the pet type refetches rather than
  // narrowing an already-loaded list.
  const load = useCallback(() => fetchServices(petType), [petType]);
  const { data: visibleServices, error, isLoading } = useAsync(load, [load]);

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
          {isLoading
            ? 'Loading services…'
            : error
              ? 'Services unavailable'
              : `${pluralize(visibleServices.length, 'service')} shown${
                  petType !== 'all' ? ` for ${activeFilterLabel?.toLowerCase()}` : ''
                }`}
        </p>
      </div>

      {error ? (
        <EmptyState
          title="We could not load our services"
          description={error.message}
          actionLabel="Try again"
          onAction={() => setPetType((current) => current)}
        />
      ) : isLoading ? (
        // Not a spinner: the status line above already announces the load, and
        // a second live region would double up for screen-reader users.
        <p className={styles.count}>Loading…</p>
      ) : visibleServices.length > 0 ? (
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
