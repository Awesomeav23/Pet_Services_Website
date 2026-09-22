import 'dotenv/config';
import pg from 'pg';

/**
 * A single pool shared by every route.
 *
 * `pg` returns NUMERIC as a string to avoid silent float precision loss. The
 * UI wants a number for price and pet age, and both are far inside the safe
 * integer range here, so the parsers are overridden once rather than in every
 * query. Type 1700 is NUMERIC.
 */
pg.types.setTypeParser(1700, (value) => (value === null ? null : Number(value)));

/**
 * DATE stays a plain "YYYY-MM-DD" string. Type 1082 is DATE.
 *
 * Left alone, `pg` builds a JS Date at local midnight, which serialises to the
 * previous day for anyone west of UTC — a booking for the 1st shows up as the
 * 30th. A calendar date has no time or zone, so it should not travel through
 * one. This is also the exact format the date input already sends.
 */
pg.types.setTypeParser(1082, (value) => value);

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/pawsome',
});

export const query = (text, params) => pool.query(text, params);
