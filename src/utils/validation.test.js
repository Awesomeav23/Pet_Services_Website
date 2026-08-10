import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  isBlank,
  validateRequired,
  validateEmail,
  validatePhone,
  validateDate,
  validatePetAge,
  validateServiceStep,
  validateDetailsStep,
  validateScheduleStep,
  validateStep,
} from './validation.js';

/**
 * Every date test runs against a pinned clock.
 *
 * Without this, "is today still valid?" would silently change meaning as the
 * calendar moved, and a suite that passes in August could fail in September.
 */
const PINNED_NOW = new Date(2026, 7, 10, 12, 0, 0); // 10 August 2026, local noon

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(PINNED_NOW);
});

describe('isBlank', () => {
  it('treats empty, whitespace-only and missing values as blank', () => {
    expect(isBlank('')).toBe(true);
    expect(isBlank('   ')).toBe(true);
    expect(isBlank(undefined)).toBe(true);
    expect(isBlank(null)).toBe(true);
  });

  it('does not treat real content as blank', () => {
    expect(isBlank('Bramble')).toBe(false);
    expect(isBlank(0)).toBe(false);
  });
});

describe('validateRequired', () => {
  it('names the field in the error message', () => {
    expect(validateRequired('', 'Pet name')).toBe('Pet name is required');
  });

  it('rejects whitespace-only input, which looks filled but is not', () => {
    expect(validateRequired('   ', 'Pet name')).toBe('Pet name is required');
  });

  it('returns undefined for valid input', () => {
    expect(validateRequired('Bramble', 'Pet name')).toBeUndefined();
  });
});

describe('validateEmail', () => {
  it('requires a value', () => {
    expect(validateEmail('')).toBe('Email address is required');
  });

  it('rejects an address with no @', () => {
    expect(validateEmail('elena.example.com')).toMatch(/name@example\.com/);
  });

  it('rejects an address with no domain extension', () => {
    expect(validateEmail('elena@example')).toMatch(/name@example\.com/);
  });

  it('rejects an address containing spaces', () => {
    expect(validateEmail('elena marsh@example.com')).toBeDefined();
  });

  it('accepts a normal address', () => {
    expect(validateEmail('elena@example.com')).toBeUndefined();
  });

  it('accepts an address with a subdomain and a plus tag', () => {
    expect(validateEmail('elena+booking@mail.example.co.uk')).toBeUndefined();
  });

  it('ignores surrounding whitespace rather than failing on it', () => {
    expect(validateEmail('  elena@example.com  ')).toBeUndefined();
  });
});

describe('validatePhone', () => {
  it('requires a value', () => {
    expect(validatePhone('')).toBe('Phone number is required');
  });

  it('rejects fewer than ten digits', () => {
    expect(validatePhone('555018774')).toBe('Enter a 10-digit phone number');
  });

  it('accepts exactly ten digits', () => {
    expect(validatePhone('5550187742')).toBeUndefined();
  });

  it('accepts eleven digits, allowing a country code', () => {
    expect(validatePhone('15550187742')).toBeUndefined();
  });

  it('rejects more than eleven digits', () => {
    expect(validatePhone('155501877421')).toBe(
      'That phone number has too many digits'
    );
  });

  it('ignores formatting characters when counting digits', () => {
    expect(validatePhone('(555) 018-7742')).toBeUndefined();
    expect(validatePhone('+1 555-018-7742')).toBeUndefined();
  });

  it('rejects input containing no digits at all', () => {
    // String.match returns null rather than an empty array when nothing
    // matches, so this exercises the fallback that keeps .length from throwing.
    expect(validatePhone('call me maybe')).toBe(
      'Enter a 10-digit phone number'
    );
  });
});

describe('validateDate', () => {
  it('requires a value', () => {
    expect(validateDate('')).toBe('Preferred date is required');
  });

  /**
   * The regression guard.
   *
   * `new Date("2026-08-10")` is parsed as midnight UTC, which is 7pm on the
   * 9th in America/Chicago — so a naive implementation would reject today as
   * being in the past. The suite is pinned to a US timezone specifically so
   * this test can catch that.
   */
  it('accepts today', () => {
    expect(validateDate('2026-08-10')).toBeUndefined();
  });

  it('rejects yesterday', () => {
    expect(validateDate('2026-08-09')).toBe(
      'Choose a date that is today or later'
    );
  });

  it('accepts tomorrow', () => {
    expect(validateDate('2026-08-11')).toBeUndefined();
  });

  it('accepts a date five months out', () => {
    expect(validateDate('2027-01-10')).toBeUndefined();
  });

  it('rejects a date beyond the six-month booking window', () => {
    expect(validateDate('2027-03-10')).toBe(
      'We only take requests up to six months ahead'
    );
  });

  it('rejects a malformed date string', () => {
    expect(validateDate('not-a-date')).toBe('Enter a valid date');
  });
});

describe('validatePetAge', () => {
  it('is optional, so blank passes', () => {
    expect(validatePetAge('')).toBeUndefined();
  });

  it('accepts a plausible age', () => {
    expect(validatePetAge('4')).toBeUndefined();
    expect(validatePetAge('0')).toBeUndefined();
  });

  it('rejects a negative age', () => {
    expect(validatePetAge('-1')).toBe('Enter an age in years, such as 4');
  });

  it('rejects non-numeric input', () => {
    expect(validatePetAge('four')).toBe('Enter an age in years, such as 4');
  });

  it('rejects an implausibly high age', () => {
    expect(validatePetAge('45')).toBe('Enter an age of 30 years or less');
  });
});

describe('step validators', () => {
  const validForm = {
    serviceId: 'grooming',
    petName: 'Bramble',
    petAge: '4',
    ownerName: 'Elena Marsh',
    email: 'elena@example.com',
    phone: '(555) 018-7742',
    preferredDate: '2026-08-14',
    consent: true,
  };

  it('step 1 requires a service to be chosen', () => {
    expect(validateServiceStep({ serviceId: '' })).toEqual({
      serviceId: 'Choose a service to continue',
    });
  });

  it('step 1 passes once a service is chosen', () => {
    expect(validateServiceStep(validForm)).toEqual({});
  });

  it('step 2 reports every missing field at once, not just the first', () => {
    const errors = validateDetailsStep({
      petName: '',
      petAge: '',
      ownerName: '',
      email: '',
      phone: '',
    });

    expect(Object.keys(errors).sort()).toEqual([
      'email',
      'ownerName',
      'petName',
      'phone',
    ]);
  });

  it('step 2 passes on a complete, valid form', () => {
    expect(validateDetailsStep(validForm)).toEqual({});
  });

  it('step 3 requires consent even when the date is fine', () => {
    expect(validateScheduleStep({ ...validForm, consent: false })).toEqual({
      consent: 'Please confirm we can contact you about this request',
    });
  });

  it('step 3 passes with a valid date and consent given', () => {
    expect(validateScheduleStep(validForm)).toEqual({});
  });

  it('omits keys for valid fields rather than storing undefined', () => {
    // The booking page treats Object.keys(errors).length as "is this step
    // valid", so a lingering undefined entry would block submission forever.
    const errors = validateDetailsStep({ ...validForm, email: 'broken' });
    expect(Object.keys(errors)).toEqual(['email']);
  });
});

describe('validateStep', () => {
  it('dispatches to the validator for the given step index', () => {
    expect(validateStep(0, { serviceId: '' })).toHaveProperty('serviceId');
    expect(validateStep(1, {})).toHaveProperty('petName');
    expect(validateStep(2, { preferredDate: '', consent: false })).toHaveProperty(
      'preferredDate'
    );
  });

  it('returns no errors for an index that has no validator', () => {
    expect(validateStep(99, {})).toEqual({});
  });
});
