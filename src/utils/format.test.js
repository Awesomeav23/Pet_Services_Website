import { describe, it, expect } from 'vitest';

import {
  formatPrice,
  formatDuration,
  formatList,
  pluralize,
} from './format.js';

describe('formatPrice', () => {
  it('formats a whole number as US currency', () => {
    expect(formatPrice(55)).toBe('$55');
  });

  it('formats zero without dropping the symbol', () => {
    expect(formatPrice(0)).toBe('$0');
  });

  it('rounds rather than showing cents, since prices are advertised whole', () => {
    expect(formatPrice(55.4)).toBe('$55');
    expect(formatPrice(55.6)).toBe('$56');
  });

  it('groups thousands', () => {
    expect(formatPrice(1200)).toBe('$1,200');
  });
});

describe('formatDuration', () => {
  it('shows minutes alone when under an hour', () => {
    expect(formatDuration(30)).toBe('30 min');
    expect(formatDuration(45)).toBe('45 min');
  });

  it('shows whole hours without a trailing zero minutes', () => {
    expect(formatDuration(60)).toBe('1 hr');
    expect(formatDuration(600)).toBe('10 hr');
  });

  it('combines hours and minutes', () => {
    expect(formatDuration(90)).toBe('1 hr 30 min');
    expect(formatDuration(135)).toBe('2 hr 15 min');
  });

  it('collapses a full day rather than reporting 24 hr', () => {
    expect(formatDuration(1440)).toBe('Full day');
  });

  it('treats anything longer than a day as a full day too', () => {
    expect(formatDuration(2880)).toBe('Full day');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0 min');
  });
});

describe('formatList', () => {
  it('returns an empty string for an empty list', () => {
    expect(formatList([])).toBe('');
  });

  it('returns a single item unchanged, with no conjunction', () => {
    expect(formatList(['Dogs'])).toBe('Dogs');
  });

  it('joins two items with "and" and no comma', () => {
    expect(formatList(['Dogs', 'Cats'])).toBe('Dogs and Cats');
  });

  it('comma-separates three or more, with "and" before the last', () => {
    expect(formatList(['Dogs', 'Cats', 'Rabbits'])).toBe(
      'Dogs, Cats and Rabbits'
    );
  });
});

describe('pluralize', () => {
  it('uses the singular for exactly one', () => {
    expect(pluralize(1, 'service')).toBe('1 service');
  });

  it('uses the plural for zero', () => {
    expect(pluralize(0, 'service')).toBe('0 services');
  });

  it('uses the plural for more than one', () => {
    expect(pluralize(7, 'service')).toBe('7 services');
  });

  it('accepts an irregular plural', () => {
    expect(pluralize(2, 'person', 'people')).toBe('2 people');
    expect(pluralize(1, 'person', 'people')).toBe('1 person');
  });
});
