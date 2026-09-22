import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Applies schema.sql.
 *
 * Every statement is CREATE ... IF NOT EXISTS, so this is safe to run against
 * an existing database. A project this size does not need migration
 * versioning; when it does, this is the file that grows one.
 */
const migrate = async () => {
  const sql = await readFile(join(here, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Schema applied: services, bookings, contact_messages.');
  await pool.end();
};

migrate().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
