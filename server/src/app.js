import compression from 'compression';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/error-handler.js';
import { bookingsRouter } from './routes/bookings.js';
import { contactRouter } from './routes/contact.js';
import { servicesRouter } from './routes/services.js';

export const createApp = () => {
  const app = express();

  // gzip on JSON responses. The catalogue is repetitive text, which is
  // exactly what compresses well.
  app.use(compression());
  // Comma-separated so the Vite dev server and the preview build the e2e
  // suite runs against can both be allowed without redeploying.
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (request, response) => response.json({ status: 'ok' }));

  /**
   * Whether this deployment can reach its database, and which one it thinks it
   * has. Unauthenticated on purpose: it answers only questions a stranger could
   * already answer by watching the site fail, and it is the difference between
   * diagnosing a deployment with one request and reading a dashboard.
   *
   * The connection string is never returned. Only the host and database name
   * are, with credentials stripped, because "is DATABASE_URL even set, and is
   * it pointing where I think" is the question that actually comes up.
   */
  app.get('/api/healthz', async (request, response) => {
    const url = process.env.DATABASE_URL;
    let target = null;
    if (url) {
      try {
        const parsed = new URL(url);
        target = `${parsed.host}${parsed.pathname}`;
      } catch {
        target = 'unparseable';
      }
    }

    try {
      const { pool } = await import('../src/db.js');
      await pool.query('select 1');
      return response.json({ status: 'ok', db: 'ok', configured: Boolean(url), target });
    } catch (error) {
      return response.status(503).json({
        status: 'degraded',
        db: 'unreachable',
        configured: Boolean(url),
        target,
        reason: error?.code ?? error?.message ?? 'unknown',
      });
    }
  });

  app.use('/api/services', servicesRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/contact', contactRouter);

  app.use((request, response) => response.status(404).json({ error: 'Not found' }));
  app.use(errorHandler);

  return app;
};
