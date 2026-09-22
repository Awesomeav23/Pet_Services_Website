/**
 * Pet-type labels.
 *
 * Presentation constants rather than catalogue data, so they stay bundled
 * while the service catalogue itself is fetched from the API. Three labels
 * are not worth a network round trip, and the filter control needs them
 * before any request resolves.
 */

/** Filter options for the services page. `all` must stay first. */
export const PET_TYPE_FILTERS = [
  { value: 'all', label: 'All pets' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
];

/** Human-readable labels for the petTypes stored on each service. */
export const PET_TYPE_LABELS = {
  dog: 'Dogs',
  cat: 'Cats',
};
