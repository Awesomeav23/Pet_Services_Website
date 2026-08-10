/** Owner reviews shown on the About page and the home page strip. */
export const TESTIMONIALS = [
  {
    id: 't-1',
    quote:
      'Bramble has always hated the groomer. Maya spent the first visit just letting him sniff the clippers and sent us home early. Third visit he walked in on his own.',
    author: 'Elena Marsh',
    petName: 'Bramble, cocker spaniel',
    rating: 5,
    service: 'Grooming & Spa',
    featured: true,
  },
  {
    id: 't-2',
    quote:
      'We boarded both cats for eleven days. Photo every evening, and they came back completely unbothered — no hiding under the bed for a week like last time.',
    author: 'Tom Iverson',
    petName: 'Nutmeg and Olive, tabbies',
    rating: 5,
    service: 'Overnight Boarding',
    featured: true,
  },
  {
    id: 't-3',
    quote:
      'The daycare report cards are genuinely useful. When Rufus started avoiding the big group they told us straight away and moved him to a smaller one.',
    author: 'Priyanka Shah',
    petName: 'Rufus, labrador',
    rating: 5,
    service: 'Doggy Daycare',
    featured: true,
  },
  {
    id: 't-4',
    quote:
      'Six weeks of classes and our reactive rescue can now pass another dog on the pavement. Sam never once suggested a prong collar, which is why we stayed.',
    author: 'Marcus Bell',
    petName: 'Juno, collie cross',
    rating: 5,
    service: 'Obedience Training',
    featured: false,
  },
  {
    id: 't-5',
    quote:
      'Same walker every day, GPS route in my inbox by 1pm. Worth it just for not worrying about it during meetings.',
    author: 'Hannah Cole',
    petName: 'Pepper, beagle',
    rating: 4,
    service: 'Dog Walking',
    featured: false,
  },
  {
    id: 't-6',
    quote:
      'Dr. Nair caught a dental problem two other vets had missed. The appointment ran long and nobody rushed us out.',
    author: 'Georgia Adeyemi',
    petName: 'Milo, maine coon',
    rating: 5,
    service: 'Veterinary Wellness',
    featured: false,
  },
];

export const getFeaturedTestimonials = () =>
  TESTIMONIALS.filter((testimonial) => testimonial.featured);
