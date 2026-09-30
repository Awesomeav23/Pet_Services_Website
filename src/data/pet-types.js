/**
 * Pet-type labels.
 *
 * Presentation constants rather than catalogue data, so they stay bundled
 * while the service catalogue itself is fetched from the API. The list is
 * short and the filter control needs it before any request resolves.
 */

/** Filter options for the services page. `all` must stay first. */
export const PET_TYPE_FILTERS = [
  { value: 'all', label: 'All pets' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'rabbit', label: 'Rabbits' },
  { value: 'bird', label: 'Birds' },
  { value: 'small-mammal', label: 'Small mammals' },
  { value: 'reptile', label: 'Reptiles' },
  { value: 'fish', label: 'Fish' },
];

/** Human-readable labels for the petTypes stored on each service. */
export const PET_TYPE_LABELS = {
  dog: 'Dogs',
  cat: 'Cats',
  rabbit: 'Rabbits',
  bird: 'Birds',
  'small-mammal': 'Small mammals',
  reptile: 'Reptiles',
  fish: 'Fish',
};
