/**
 * Booking form validation.
 *
 * Kept as plain functions outside the component so each rule can be reasoned
 * about (and reused) on its own. Every validator returns an error string or
 * undefined, and the step validators collect those into a { field: message }
 * object — an empty object means the step is valid.
 */

// Deliberately permissive: the goal is to catch typos such as a missing "@",
// not to police which addresses are legal.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts 10-digit US numbers with common separators. */
const PHONE_DIGITS = /\d/g;

export const isBlank = (value) => !value || String(value).trim() === '';

export const validateRequired = (value, label) =>
  isBlank(value) ? `${label} is required` : undefined;

export const validateEmail = (value) => {
  if (isBlank(value)) return 'Email address is required';
  if (!EMAIL_PATTERN.test(value.trim()))
    return 'Enter an email address in the format name@example.com';
  return undefined;
};

export const validatePhone = (value) => {
  if (isBlank(value)) return 'Phone number is required';
  const digitCount = (value.match(PHONE_DIGITS) || []).length;
  if (digitCount < 10) return 'Enter a 10-digit phone number';
  if (digitCount > 11) return 'That phone number has too many digits';
  return undefined;
};

/** Today at midnight, so "today" itself is always a valid choice. */
const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const validateDate = (value) => {
  if (isBlank(value)) return 'Preferred date is required';

  // A date-only string parses as UTC, which can land on the previous day in
  // western timezones; split it so the Date is built in local time.
  const [year, month, day] = value.split('-').map(Number);
  const chosen = new Date(year, month - 1, day);

  if (Number.isNaN(chosen.getTime())) return 'Enter a valid date';
  if (chosen < startOfToday()) return 'Choose a date that is today or later';

  const sixMonthsOut = new Date();
  sixMonthsOut.setMonth(sixMonthsOut.getMonth() + 6);
  if (chosen > sixMonthsOut)
    return 'We only take requests up to six months ahead';

  return undefined;
};

export const validatePetAge = (value) => {
  if (isBlank(value)) return undefined; // optional field
  const age = Number(value);
  if (Number.isNaN(age) || age < 0) return 'Enter an age in years, such as 4';
  if (age > 30) return 'Enter an age of 30 years or less';
  return undefined;
};

/** Strips undefined entries so callers can treat {} as "no errors". */
const compact = (errors) =>
  Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined)
  );

export const validateServiceStep = (form) =>
  compact({
    serviceId: isBlank(form.serviceId) ? 'Choose a service to continue' : undefined,
  });

export const validateDetailsStep = (form) =>
  compact({
    petName: validateRequired(form.petName, 'Pet name'),
    petAge: validatePetAge(form.petAge),
    ownerName: validateRequired(form.ownerName, 'Your name'),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
  });

export const validateScheduleStep = (form) =>
  compact({
    preferredDate: validateDate(form.preferredDate),
    consent: form.consent
      ? undefined
      : 'Please confirm we can contact you about this request',
  });

/** Validators indexed by step number, so the page can stay generic. */
export const STEP_VALIDATORS = [
  validateServiceStep,
  validateDetailsStep,
  validateScheduleStep,
];

export const validateStep = (stepIndex, form) =>
  STEP_VALIDATORS[stepIndex] ? STEP_VALIDATORS[stepIndex](form) : {};
