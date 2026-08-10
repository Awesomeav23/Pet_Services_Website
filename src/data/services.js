/**
 * Service catalogue.
 *
 * Static module for now; the shape matches what a REST endpoint would return,
 * so swapping this import for a fetch() later requires no component changes.
 */
export const SERVICES = [
  {
    id: 'grooming',
    name: 'Grooming & Spa',
    tagline: 'Baths, trims and nail care by certified groomers',
    description:
      'A full groom tailored to your pet’s coat and temperament. We work at your pet’s pace, with a break whenever they need one, and we never use cage dryers.',
    price: 55,
    priceUnit: 'per visit',
    duration: 90,
    petTypes: ['dog', 'cat'],
    icon: '🛁',
    popular: true,
    includes: [
      'Warm hydrobath with coat-specific shampoo',
      'Blow dry and full brush-out',
      'Breed-standard or custom clip',
      'Nail trim and filing',
      'Ear cleaning and sanitary trim',
    ],
  },
  {
    id: 'boarding',
    name: 'Overnight Boarding',
    tagline: 'Home-style overnight stays with evening updates',
    description:
      'Your pet sleeps in a private, climate-controlled suite with real bedding rather than a wire crate. Every guest gets four supervised play sessions a day and a photo update each evening.',
    price: 48,
    priceUnit: 'per night',
    duration: 1440,
    petTypes: ['dog', 'cat'],
    icon: '🏠',
    popular: true,
    includes: [
      'Private suite with orthopaedic bedding',
      'Four supervised play or quiet sessions daily',
      'Your own food and feeding schedule kept',
      'Medication administered at no extra cost',
      'Nightly photo and text update',
    ],
  },
  {
    id: 'daycare',
    name: 'Doggy Daycare',
    tagline: 'Supervised play in small, temperament-matched groups',
    description:
      'A full day of structured play, training games and rest. Groups are capped at eight dogs and matched by size and play style, so boisterous puppies are never mixed with quiet seniors.',
    price: 34,
    priceUnit: 'per day',
    duration: 600,
    petTypes: ['dog'],
    icon: '🎾',
    popular: true,
    includes: [
      'Groups capped at eight, matched by size and energy',
      'Indoor and outdoor play areas',
      'Structured rest period after lunch',
      'Daily report card on how the day went',
      'Discounted multi-day packages',
    ],
  },
  {
    id: 'dog-walking',
    name: 'Dog Walking',
    tagline: 'GPS-tracked neighbourhood walks, solo or small group',
    description:
      'A reliable midday walk from a walker your dog knows by name. You get the GPS route, the duration and a photo the moment the walk ends.',
    price: 24,
    priceUnit: 'per walk',
    duration: 30,
    petTypes: ['dog'],
    icon: '🦮',
    popular: false,
    includes: [
      'Choice of 30 or 60 minute walks',
      'Solo or small-group options',
      'Live GPS route shared after every walk',
      'Fresh water and paw wipe-down on return',
      'The same walker on every scheduled visit',
    ],
  },
  {
    id: 'training',
    name: 'Obedience Training',
    tagline: 'Positive-reinforcement classes and private sessions',
    description:
      'Reward-based training that builds skills without intimidation. Choose a six-week group course for the fundamentals, or private sessions for reactivity, recall and other specific issues.',
    price: 70,
    priceUnit: 'per session',
    duration: 60,
    petTypes: ['dog'],
    icon: '🎓',
    popular: false,
    includes: [
      'Puppy foundations and adult obedience courses',
      'Private sessions for reactivity and recall',
      'Force-free, reward-based methods only',
      'Written practice plan after each session',
      'Follow-up support between sessions',
    ],
  },
  {
    id: 'wellness',
    name: 'Veterinary Wellness',
    tagline: 'Routine check-ups, vaccinations and microchipping',
    description:
      'Preventative care with a licensed veterinarian in a low-stress setting. Appointments run long enough that nobody feels rushed, and we send records straight to your primary vet.',
    price: 65,
    priceUnit: 'per exam',
    duration: 45,
    petTypes: ['dog', 'cat'],
    icon: '🩺',
    popular: false,
    includes: [
      'Full nose-to-tail physical examination',
      'Core and lifestyle vaccinations',
      'Microchip implant and registration',
      'Parasite screening and prevention plan',
      'Records forwarded to your primary vet',
    ],
  },
  {
    id: 'pet-taxi',
    name: 'Pet Taxi',
    tagline: 'Safe, crated transport to appointments and back',
    description:
      'Door-to-door transport in a climate-controlled vehicle with secured crates. Useful when a vet appointment falls in the middle of your workday.',
    price: 30,
    priceUnit: 'per trip',
    duration: 45,
    petTypes: ['dog', 'cat'],
    icon: '🚐',
    popular: false,
    includes: [
      'Climate-controlled vehicle with secured crates',
      'Door-to-door pickup and return',
      'Text confirmation at every leg of the trip',
      'Waiting time included for short appointments',
      'Flat rate within a 15 mile radius',
    ],
  },
];

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

export const getServiceById = (id) =>
  SERVICES.find((service) => service.id === id);

export const getPopularServices = () =>
  SERVICES.filter((service) => service.popular);

export const filterServicesByPetType = (petType) =>
  petType === 'all'
    ? SERVICES
    : SERVICES.filter((service) => service.petTypes.includes(petType));
