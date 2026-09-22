/**
 * Thin fetch wrapper for the Pawsome API.
 *
 * Kept deliberately small: no caching layer, no retry policy. The catalogue
 * responses carry Cache-Control, so the browser's own HTTP cache does that
 * job, and a failed request surfaces to the caller rather than being retried
 * behind the user's back.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

/**
 * Thrown for any non-2xx response.
 *
 * `fieldErrors` carries the { field: message } object a 422 returns, so a form
 * can drop server-side validation straight into the same error state it uses
 * for its own checks.
 */
export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
  }
}

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    // A network failure is not the same as a rejected request, and the
    // message a user sees should say so.
    throw new ApiError('Could not reach the server. Check your connection and try again.');
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(body.error ?? 'Something went wrong', {
      status: response.status,
      fieldErrors: body.errors,
    });
  }

  return body;
};

/** GET /api/services — the whole catalogue, or one pet type's worth. */
export const fetchServices = (petType = 'all') =>
  request(`/services${petType && petType !== 'all' ? `?petType=${encodeURIComponent(petType)}` : ''}`);

/** GET /api/services/:id */
export const fetchService = (id) => request(`/services/${encodeURIComponent(id)}`);

/** POST /api/bookings */
export const createBooking = (form) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(form) });

/** GET /api/bookings/:reference */
export const fetchBooking = (reference) =>
  request(`/bookings/${encodeURIComponent(reference)}`);

/** POST /api/contact */
export const sendContactMessage = (form) =>
  request('/contact', { method: 'POST', body: JSON.stringify(form) });
