/**
 * Shared display formatters.
 *
 * Kept out of the components so price and duration render identically on the
 * service cards, the detail pages and the booking summary.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 55 -> "$55" */
export const formatPrice = (amount) => currencyFormatter.format(amount);

/**
 * Minutes to a readable duration.
 * 30 -> "30 min", 90 -> "1 hr 30 min", 600 -> "10 hr", 1440 -> "Full day"
 */
export const formatDuration = (minutes) => {
  if (minutes >= 1440) return 'Full day';

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
};

/** ['dog', 'cat'] -> "Dogs and cats" */
export const formatList = (items) => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

/** 3 -> "3 services", 1 -> "1 service" */
export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;
