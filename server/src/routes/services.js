import { Router } from 'express';
import { query } from '../db.js';

export const servicesRouter = Router();

/**
 * Maps a row onto the shape the components already consume.
 *
 * The front end was written against `src/data/services.js`, so the API matches
 * that contract exactly — camelCase keys, `duration` rather than
 * `duration_min`. Keeping the translation here means no component had to
 * change when the data moved behind the network.
 */
const toService = (row) => ({
  id: row.id,
  name: row.name,
  tagline: row.tagline,
  description: row.description,
  price: row.price,
  priceUnit: row.price_unit,
  duration: row.duration_min,
  petTypes: row.pet_types,
  icon: row.icon,
  popular: row.popular,
  includes: row.includes,
});

const SELECT_SERVICE = `
  SELECT id, name, tagline, description, price, price_unit,
         duration_min, pet_types, icon, popular, includes
  FROM services`;

/**
 * GET /api/services[?petType=dog]
 *
 * The filter runs in SQL against the GIN index rather than being applied in
 * JavaScript after fetching everything — the wire payload shrinks with the
 * filter, which is the whole point of moving the catalogue server-side.
 */
servicesRouter.get('/', async (request, response, next) => {
  try {
    const { petType } = request.query;

    const { rows } =
      petType && petType !== 'all'
        ? await query(`${SELECT_SERVICE} WHERE $1 = ANY (pet_types) ORDER BY sort_order`, [petType])
        : await query(`${SELECT_SERVICE} ORDER BY sort_order`);

    // Catalogue changes rarely and is identical for every visitor, so it is
    // safe to let the browser and any CDN in front of it hold a copy.
    response.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    response.json(rows.map(toService));
  } catch (error) {
    next(error);
  }
});

/** GET /api/services/:id — backs the service detail page. */
servicesRouter.get('/:id', async (request, response, next) => {
  try {
    const { rows } = await query(`${SELECT_SERVICE} WHERE id = $1`, [request.params.id]);

    if (rows.length === 0) {
      return response.status(404).json({ error: 'Service not found' });
    }

    response.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    response.json(toService(rows[0]));
  } catch (error) {
    next(error);
  }
});
