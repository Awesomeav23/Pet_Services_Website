import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

/**
 * Starts and stops a project-local PostgreSQL.
 *
 * The binaries come from the `embedded-postgres` package rather than a system
 * install, so `npm install` is the only prerequisite — no Homebrew, no Docker,
 * and no admin rights. The cluster lives in server/.pgdata and is gitignored.
 */
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const bin = join(root, 'node_modules/@embedded-postgres/darwin-arm64/native/bin');
const data = join(root, '.pgdata');
const PORT = 5433;

const run = (cmd, args) =>
  execFileSync(join(bin, cmd), args, { stdio: 'inherit', cwd: root });

const start = async () => {
  if (!existsSync(data)) {
    console.log('Initialising cluster in server/.pgdata …');
    run('initdb', ['-D', data, '-U', 'postgres', '--auth=trust', '--encoding=UTF8']);
  }

  try {
    run('pg_ctl', ['-D', data, '-l', join(data, 'server.log'), '-o', `-p ${PORT} -k /tmp`, 'start']);
  } catch {
    console.log('Server already running.');
  }

  // initdb only creates the `postgres` database; ours has to be added once.
  const client = new pg.Client({ host: 'localhost', port: PORT, user: 'postgres', database: 'postgres' });
  await client.connect();
  const { rows } = await client.query("SELECT 1 FROM pg_database WHERE datname = 'pawsome'");
  if (rows.length === 0) {
    await client.query('CREATE DATABASE pawsome');
    console.log('Created database "pawsome".');
  }
  await client.end();

  console.log(`PostgreSQL ready on postgresql://postgres@localhost:${PORT}/pawsome`);
};

const stop = () => run('pg_ctl', ['-D', data, 'stop']);

const command = process.argv[2];
if (command === 'start') await start();
else if (command === 'stop') stop();
else {
  console.error('Usage: node scripts/db.mjs <start|stop>');
  process.exitCode = 1;
}
