/**
 * Single source of truth for the primary navigation.
 *
 * Both the header and the footer read from this list, so a section only ever
 * needs to be registered in one place.
 */
export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Book a Visit' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export const CONTACT_DETAILS = {
  phone: '(555) 018-7742',
  phoneHref: 'tel:+15550187742',
  email: 'hello@pawsomepets.example',
  emailHref: 'mailto:hello@pawsomepets.example',
  addressLines: ['418 Maple Ridge Road', 'Springfield, IL 62704'],
  hours: [
    { days: 'Monday – Friday', time: '7:00 AM – 7:00 PM' },
    { days: 'Saturday', time: '8:00 AM – 5:00 PM' },
    { days: 'Sunday', time: '10:00 AM – 4:00 PM' },
  ],
};
