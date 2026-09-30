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

/**
 * Maps common words a user might type to the canonical filter value.
 *
 * Kept intentionally small: this is a hand-curated set of the pets someone
 * is likely to enter for each category, not a taxonomy. Anything absent
 * falls through to the empty state, which is preferable to a false match.
 */
const SYNONYMS = {
  dog: ['dog', 'dogs', 'puppy', 'puppies', 'pup', 'doggy', 'doggo'],
  cat: ['cat', 'cats', 'kitten', 'kittens', 'kitty'],
  rabbit: ['rabbit', 'rabbits', 'bunny', 'bunnies'],
  bird: ['bird', 'birds', 'parrot', 'cockatiel', 'budgie', 'budgerigar', 'canary', 'parakeet'],
  'small-mammal': [
    'small mammal', 'small mammals',
    'hamster', 'hamsters',
    'guinea pig', 'guinea pigs',
    'gerbil', 'gerbils',
    'ferret', 'ferrets',
    'chinchilla', 'chinchillas',
    'rat', 'rats',
    'mouse', 'mice',
    'hedgehog', 'hedgehogs',
  ],
  reptile: [
    'reptile', 'reptiles',
    'snake', 'snakes',
    'lizard', 'lizards',
    'turtle', 'turtles',
    'tortoise', 'tortoises',
    'gecko', 'geckos',
    'iguana', 'iguanas',
    'bearded dragon',
  ],
  fish: ['fish', 'fishes', 'goldfish', 'betta', 'koi'],
  all: ['all', 'all pets', 'any', 'anything'],
};

/**
 * Sentinel returned when the input doesn't map to a known pet type.
 *
 * Sent to the API unchanged; the query never matches, so the grid renders
 * its own "no services match" empty state without special-casing here.
 */
export const NO_MATCH = '__no-match__';

const LOOKUP = new Map();
for (const [canonical, terms] of Object.entries(SYNONYMS)) {
  for (const term of terms) {
    LOOKUP.set(term, canonical);
  }
}

/**
 * Turns a user-entered string into a canonical filter value.
 *
 * Empty input → 'all'.
 * Exact synonym match → the canonical value (e.g. 'bunny' → 'rabbit').
 * Prefix match against exactly one canonical group → that value
 *   (so 'rabb' resolves to 'rabbit' before the word is finished).
 * Anything else → NO_MATCH.
 */
export const resolvePetType = (input) => {
  const key = String(input ?? '').trim().toLowerCase();
  if (!key) return 'all';
  if (LOOKUP.has(key)) return LOOKUP.get(key);

  const matches = new Set();
  for (const term of LOOKUP.keys()) {
    if (term.startsWith(key)) matches.add(LOOKUP.get(term));
    if (matches.size > 1) break;
  }
  return matches.size === 1 ? [...matches][0] : NO_MATCH;
};
