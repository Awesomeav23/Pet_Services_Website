import { SERVICES } from '../../src/data/services.js';
import { pool } from './db.js';

/**
 * Seeds the catalogue from the front-end data module.
 *
 * That module stays the single source of truth for the seven services, so
 * there is no second copy of the catalogue to keep in step. The API reads
 * from PostgreSQL at runtime; this file is only how the rows get there.
 *
 * Upserts rather than inserts, so re-running after an edit updates rows
 * instead of failing on the primary key.
 */
const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const [index, service] of SERVICES.entries()) {
      await client.query(
        `INSERT INTO services
           (id, name, tagline, description, price, price_unit,
            duration_min, pet_types, icon, popular, includes, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           name         = EXCLUDED.name,
           tagline      = EXCLUDED.tagline,
           description  = EXCLUDED.description,
           price        = EXCLUDED.price,
           price_unit   = EXCLUDED.price_unit,
           duration_min = EXCLUDED.duration_min,
           pet_types    = EXCLUDED.pet_types,
           icon         = EXCLUDED.icon,
           popular      = EXCLUDED.popular,
           includes     = EXCLUDED.includes,
           sort_order   = EXCLUDED.sort_order`,
        [
          service.id,
          service.name,
          service.tagline,
          service.description,
          service.price,
          service.priceUnit,
          service.duration,
          service.petTypes,
          service.icon,
          service.popular ?? false,
          service.includes ?? [],
          index,
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${SERVICES.length} services.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
});
