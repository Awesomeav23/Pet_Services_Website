import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Exercises the real client.
 *
 * Every other suite gets the mocked module installed in test/setup.js, so this
 * file reaches past it with importActual and stubs `fetch` instead — otherwise
 * the one piece of code that talks to the network would never be tested.
 */
const { fetchServices, fetchService, createBooking, sendContactMessage, ApiError } =
  await vi.importActual('./client.js');

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(jsonResponse([]))));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchServices', () => {
  it('asks for the whole catalogue when no pet type is given', async () => {
    await fetchServices();
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/services$/), expect.anything());
  });

  it('treats "all" as no filter rather than a pet type', async () => {
    await fetchServices('all');
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/services$/), expect.anything());
  });

  it('passes a real pet type through as a query parameter', async () => {
    await fetchServices('cat');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/services?petType=cat'),
      expect.anything(),
    );
  });

  it('encodes a pet type that would otherwise break the URL', async () => {
    await fetchServices('small & furry');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('petType=small%20%26%20furry'),
      expect.anything(),
    );
  });
});

describe('error handling', () => {
  it('raises an ApiError carrying the status for a 404', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({ error: 'Service not found' }, 404));

    await expect(fetchService('nope')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Service not found',
    });
  });

  it('surfaces the per-field errors from a 422 so a form can render them', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({ error: 'Validation failed', errors: { email: 'Bad email' } }, 422),
    );

    await expect(createBooking({})).rejects.toMatchObject({
      status: 422,
      fieldErrors: { email: 'Bad email' },
    });
  });

  it('reports an unreachable server differently from a rejected request', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    // The user is told to check their connection, not handed "Failed to fetch".
    await expect(fetchServices()).rejects.toThrow(/could not reach the server/i);
  });

  it('still raises an ApiError when the body is not JSON', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    });

    await expect(fetchServices()).rejects.toBeInstanceOf(ApiError);
  });
});

describe('writes', () => {
  it('posts the booking as JSON', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({ reference: 'PAW-ABC123' }, 201));

    const result = await createBooking({ serviceId: 'grooming', petName: 'Mochi' });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/bookings'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ serviceId: 'grooming', petName: 'Mochi' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
    expect(result).toEqual({ reference: 'PAW-ABC123' });
  });

  it('returns null for a 204, rather than trying to parse an empty body', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 204, json: () => Promise.reject() });

    await expect(sendContactMessage({})).resolves.toBeNull();
  });
});
